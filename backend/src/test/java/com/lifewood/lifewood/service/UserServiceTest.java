package com.lifewood.lifewood.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.lifewood.lifewood.dto.user.ChangePasswordDTO;
import com.lifewood.lifewood.dto.user.UpdateMyProfileDTO;
import com.lifewood.lifewood.dto.user.UserResponseDTO;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.enumeration.UserRoleEnum;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.BadRequestException;
import com.lifewood.lifewood.util.ResourceNotFoundException;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        testUser = UserEntity.builder()
                .id(7L)
                .username("portal.user")
                .email("portal@example.com")
                .firstName("Portal")
                .lastName("User")
                .phoneNumber("09170000000")
                .profilePicture("avatar.png")
                .role(UserRoleEnum.USER)
                .password("hashed-old")
                .build();
    }

    @Test
    void getCurrentUser_returnsMappedUser() {
        when(userRepository.findByUsername("portal.user")).thenReturn(Optional.of(testUser));

        UserResponseDTO response = userService.getCurrentUser("portal.user");

        assertEquals(7L, response.getId());
        assertEquals("portal.user", response.getUsername());
        assertEquals(UserRoleEnum.USER, response.getRole());
    }

    @Test
    void getCurrentUser_throwsWhenMissing() {
        when(userRepository.findByUsername("missing")).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(
                ResourceNotFoundException.class,
                () -> userService.getCurrentUser("missing"));

        assertTrue(ex.getMessage().contains("missing"));
    }

    @Test
    void updateCurrentUser_updatesEditableFields() {
        UpdateMyProfileDTO request = new UpdateMyProfileDTO();
        request.setEmail("updated@example.com");
        request.setFirstName("Updated");
        request.setLastName("Name");
        request.setPhoneNumber("09990001111");
        request.setProfilePicture("new-avatar.png");

        when(userRepository.findByUsername("portal.user")).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("updated@example.com")).thenReturn(false);
        when(userRepository.save(any(UserEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO response = userService.updateCurrentUser("portal.user", request);

        assertEquals("updated@example.com", response.getEmail());
        assertEquals("Updated", response.getFirstName());
        assertEquals("Name", response.getLastName());
        assertEquals(UserRoleEnum.USER, response.getRole());
    }

    @Test
    void updateCurrentUser_throwsWhenEmailAlreadyExists() {
        UpdateMyProfileDTO request = new UpdateMyProfileDTO();
        request.setEmail("taken@example.com");
        request.setFirstName("Updated");
        request.setLastName("Name");

        when(userRepository.findByUsername("portal.user")).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);

        BadRequestException ex = assertThrows(
                BadRequestException.class,
                () -> userService.updateCurrentUser("portal.user", request));

        assertEquals("Email already exists", ex.getMessage());
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    void changeCurrentUserPassword_updatesPasswordWhenOldPasswordMatches() {
        ChangePasswordDTO request = new ChangePasswordDTO();
        request.setOldPassword("old-pass");
        request.setNewPassword("new-pass-123");

        when(userRepository.findByUsername("portal.user")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("old-pass", "hashed-old")).thenReturn(true);
        when(passwordEncoder.encode("new-pass-123")).thenReturn("hashed-new");

        userService.changeCurrentUserPassword("portal.user", request);

        assertEquals("hashed-new", testUser.getPassword());
        verify(userRepository).save(testUser);
    }

    @Test
    void changeCurrentUserPassword_throwsWhenOldPasswordMismatch() {
        ChangePasswordDTO request = new ChangePasswordDTO();
        request.setOldPassword("wrong-old");
        request.setNewPassword("new-pass-123");

        when(userRepository.findByUsername("portal.user")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrong-old", "hashed-old")).thenReturn(false);

        BadRequestException ex = assertThrows(
                BadRequestException.class,
                () -> userService.changeCurrentUserPassword("portal.user", request));

        assertEquals("Old password is incorrect", ex.getMessage());
        verify(userRepository, never()).save(any(UserEntity.class));
    }
}

