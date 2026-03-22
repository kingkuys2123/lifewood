package com.lifewood.lifewood.controller;

import com.lifewood.lifewood.dto.ApiResponse;
import com.lifewood.lifewood.dto.user.AddUserDTO;
import com.lifewood.lifewood.dto.user.ChangePasswordDTO;
import com.lifewood.lifewood.dto.user.UpdateMyProfileDTO;
import com.lifewood.lifewood.dto.user.UpdateUserDTO;
import com.lifewood.lifewood.dto.user.UserResponseDTO;
import com.lifewood.lifewood.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UserResponseDTO>> createUser(@Valid @RequestBody AddUserDTO request) {
        return ResponseEntity.ok(ApiResponse.success("UserEntity created successfully", userService.createUser(request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUser(@RequestParam("id") Long id) {
        return ResponseEntity.ok(ApiResponse.success("UserEntity fetched successfully", userService.getUser(id)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully",
                userService.getCurrentUser(authentication.getName())));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/get/all")
    public ResponseEntity<ApiResponse<Page<UserResponseDTO>>> getAllUsers(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", userService.getAllUsers(keyword, pageable)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateUser(
            @RequestParam("id") Long id,
            @Valid @RequestBody UpdateUserDTO request) {
        return ResponseEntity.ok(ApiResponse.success("UserEntity updated successfully", userService.updateUser(id, request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateMyProfile(
            @Valid @RequestBody UpdateMyProfileDTO request,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("User profile updated successfully",
                userService.updateCurrentUser(authentication.getName(), request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PatchMapping("/change-password")
    public ResponseEntity<ApiResponse<Object>> changePassword(
            @RequestParam("id") Long id,
            @Valid @RequestBody ChangePasswordDTO request) {
        userService.changePassword(id, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PatchMapping("/me/change-password")
    public ResponseEntity<ApiResponse<Object>> changeMyPassword(
            @Valid @RequestBody ChangePasswordDTO request,
            Authentication authentication) {
        userService.changeCurrentUserPassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@RequestParam("id") Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("UserEntity deleted successfully", null));
    }
}

