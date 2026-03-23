package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.user.AddUserDTO;
import com.lifewood.lifewood.dto.user.ChangePasswordDTO;
import com.lifewood.lifewood.dto.user.UpdateMyProfileDTO;
import com.lifewood.lifewood.dto.user.UpdateUserDTO;
import com.lifewood.lifewood.dto.user.UserResponseDTO;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.BadRequestException;
import com.lifewood.lifewood.util.ResourceNotFoundException;
import com.lifewood.lifewood.util.UserSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDTO createUser(AddUserDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email has already been used");
        }

        UserEntity userEntity = UserEntity.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .profilePicture(request.getProfilePicture())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        UserEntity savedUserEntity = userRepository.save(userEntity);
        log.info("Created userEntity with username={}", savedUserEntity.getUsername());
        return mapToResponse(savedUserEntity);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUser(Long id) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserEntity not found with id: " + id));
        return mapToResponse(userEntity);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getCurrentUser(String username) {
        return mapToResponse(getUserEntityByUsername(username));
    }

    @Transactional(readOnly = true)
    public Page<UserResponseDTO> getAllUsers(String keyword, Pageable pageable) {
        return userRepository.findAll(UserSpecifications.withKeyword(keyword), pageable).map(this::mapToResponse);
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UpdateUserDTO request) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserEntity not found with id: " + id));

        if (!userEntity.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email has already been used");
        }

        userEntity.setEmail(request.getEmail());
        userEntity.setProfilePicture(request.getProfilePicture());
        userEntity.setFirstName(request.getFirstName());
        userEntity.setLastName(request.getLastName());
        userEntity.setPhoneNumber(request.getPhoneNumber());
        userEntity.setRole(request.getRole());

        return mapToResponse(userRepository.save(userEntity));
    }

    @Transactional
    public UserResponseDTO updateCurrentUser(String username, UpdateMyProfileDTO request) {
        UserEntity userEntity = getUserEntityByUsername(username);

        if (!userEntity.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email has already been used");
        }

        userEntity.setEmail(request.getEmail());
        userEntity.setProfilePicture(request.getProfilePicture());
        userEntity.setFirstName(request.getFirstName());
        userEntity.setLastName(request.getLastName());
        userEntity.setPhoneNumber(request.getPhoneNumber());

        return mapToResponse(userRepository.save(userEntity));
    }

    @Transactional
    public void changePassword(Long id, ChangePasswordDTO request) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserEntity not found with id: " + id));

        if (!passwordEncoder.matches(request.getOldPassword(), userEntity.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        userEntity.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(userEntity);
    }

    @Transactional
    public void changeCurrentUserPassword(String username, ChangePasswordDTO request) {
        UserEntity userEntity = getUserEntityByUsername(username);

        if (!passwordEncoder.matches(request.getOldPassword(), userEntity.getPassword())) {
            throw new BadRequestException("Old password is incorrect");
        }

        userEntity.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(userEntity);
    }

    @Transactional
    public void resetPasswordByAdmin(Long id, String newPassword) {
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserEntity not found with id: " + id));

        validatePasswordQuality(newPassword);

        if (passwordEncoder.matches(newPassword, userEntity.getPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }

        userEntity.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userEntity);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("UserEntity not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserEntity getUserEntityByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("UserEntity not found with username: " + username));
    }

    private void validatePasswordQuality(String password) {
        String value = password == null ? "" : password.trim();
        if (value.length() < 8 || value.length() > 72) {
            throw new BadRequestException("Password must be between 8 and 72 characters");
        }

        boolean hasLetter = value.chars().anyMatch(Character::isLetter);
        boolean hasDigit = value.chars().anyMatch(Character::isDigit);
        if (!hasLetter || !hasDigit) {
            throw new BadRequestException("Password must include at least one letter and one number");
        }
    }

    private UserResponseDTO mapToResponse(UserEntity userEntity) {
        return UserResponseDTO.builder()
                .id(userEntity.getId())
                .username(userEntity.getUsername())
                .email(userEntity.getEmail())
                .profilePicture(userEntity.getProfilePicture())
                .firstName(userEntity.getFirstName())
                .lastName(userEntity.getLastName())
                .phoneNumber(userEntity.getPhoneNumber())
                .role(userEntity.getRole())
                .createdAt(userEntity.getCreatedAt())
                .updatedAt(userEntity.getUpdatedAt())
                .build();
    }
}
