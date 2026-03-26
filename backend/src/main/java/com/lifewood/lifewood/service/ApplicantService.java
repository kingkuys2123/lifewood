package com.lifewood.lifewood.service;

import com.lifewood.lifewood.dto.applicant.AddApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApproveApplicantDTO;
import com.lifewood.lifewood.dto.applicant.ApplicantResponseDTO;
import com.lifewood.lifewood.dto.applicant.DenyApplicantDTO;
import com.lifewood.lifewood.dto.applicant.UpdateApplicantDTO;
import com.lifewood.lifewood.dto.dashboard.AdminPerformanceDTO;
import com.lifewood.lifewood.dto.dashboard.ApplicantsOverviewDTO;
import com.lifewood.lifewood.dto.dashboard.SubmissionPointDTO;
import com.lifewood.lifewood.dto.dashboard.SubmissionSeriesDTO;
import com.lifewood.lifewood.dto.notification.ApprovalNotificationDTO;
import com.lifewood.lifewood.entity.ApplicantEntity;
import com.lifewood.lifewood.entity.NotificationEntity;
import com.lifewood.lifewood.entity.UserEntity;
import com.lifewood.lifewood.enumeration.NotificationTypeEnum;
import com.lifewood.lifewood.enumeration.UserRoleEnum;
import com.lifewood.lifewood.repository.ApplicantRepository;
import com.lifewood.lifewood.repository.UserRepository;
import com.lifewood.lifewood.util.ApplicantSpecifications;
import com.lifewood.lifewood.util.BadRequestException;
import com.lifewood.lifewood.util.FileUtil;
import com.lifewood.lifewood.util.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicantService {

    public record ResumeFile(Resource resource, String fileName, String contentType) {
    }

    private final ApplicantRepository applicantRepository;
    private final FileUtil fileUtil;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Value("${app.dashboard.zone-id:UTC}")
    private String dashboardZoneId;

    @Transactional
    public ApplicantResponseDTO createApplicant(AddApplicantDTO request) {
        ensureEmailAvailable(request.getEmail(), null);

        String resumePath = fileUtil.storeResume(request.getResume());
        ApplicantEntity applicantEntity = ApplicantEntity.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .age(request.getAge())
                .email(request.getEmail())
                .degree(request.getDegree())
                .projectAppliedFor(request.getProjectAppliedFor())
                .experience(request.getExperience())
                .resumePath(resumePath)
                .build();

        ApplicantEntity savedApplicantEntity = applicantRepository.save(applicantEntity);
        emailService.sendApplicantSubmissionNotification(
                savedApplicantEntity.getEmail(),
                savedApplicantEntity.getFirstName() + " " + savedApplicantEntity.getLastName(),
                savedApplicantEntity.getProjectAppliedFor());

        log.info("Created applicantEntity id={} email={}", savedApplicantEntity.getId(), savedApplicantEntity.getEmail());
        return mapToResponse(savedApplicantEntity);
    }

    @Transactional(readOnly = true)
    public ApplicantResponseDTO getApplicant(Long id) {
        ApplicantEntity applicantEntity = getApplicantById(id);
        return mapToResponse(applicantEntity);
    }

    @Transactional(readOnly = true)
    public ResumeFile getApplicantResume(Long id) {
        ApplicantEntity applicantEntity = getApplicantById(id);

        Resource resource = fileUtil.loadResumeResource(applicantEntity.getResumePath());
        String fileName = resource.getFilename() == null ? "resume" : resource.getFilename();
        String contentType = null;
        try {
            contentType = fileUtil.resolveContentType(resource.getFile().toPath());
        } catch (Exception ex) {
            log.debug("Unable to resolve resume content type for applicant id={}", id, ex);
        }
        return new ResumeFile(resource, fileName, contentType);
    }

    @Transactional(readOnly = true)
    public Page<ApplicantResponseDTO> getAllApplicants(String keyword, Boolean approved, Boolean reviewed, Pageable pageable) {
        Specification<ApplicantEntity> specification = Specification.where(ApplicantSpecifications.withActive())
                .and(ApplicantSpecifications.withKeyword(keyword))
                .and(ApplicantSpecifications.withApproved(approved))
                .and(ApplicantSpecifications.withReviewed(reviewed));
        return applicantRepository.findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<ApplicantResponseDTO> getPendingApplicants(Pageable pageable) {
        return applicantRepository.findAllByReviewedFalseAndDeletedAtIsNull(pageable).map(this::mapToResponse);
    }

    @Transactional
    public ApplicantResponseDTO updateApplicant(Long id, UpdateApplicantDTO request) {
        ApplicantEntity applicantEntity = getApplicantById(id);

        ensureEmailAvailable(request.getEmail(), id);

        applicantEntity.setFirstName(request.getFirstName());
        applicantEntity.setLastName(request.getLastName());
        applicantEntity.setAge(request.getAge());
        applicantEntity.setEmail(request.getEmail());
        applicantEntity.setDegree(request.getDegree());
        applicantEntity.setProjectAppliedFor(request.getProjectAppliedFor());
        applicantEntity.setExperience(request.getExperience());

        if (request.getResume() != null && !request.getResume().isEmpty()) {
            applicantEntity.setResumePath(fileUtil.storeResume(request.getResume()));
        }

        return mapToResponse(applicantRepository.save(applicantEntity));
    }

    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email, Long excludeApplicantId) {
        String normalizedEmail = normalizeEmail(email);
        if (normalizedEmail.isEmpty()) {
            return false;
        }

        if (excludeApplicantId != null) {
            return !applicantRepository.existsByEmailIgnoreCaseAndDeletedAtIsNullAndIdNot(normalizedEmail, excludeApplicantId);
        }

        return !applicantRepository.existsByEmailIgnoreCaseAndDeletedAtIsNull(normalizedEmail);
    }

    @Transactional
    public void deleteApplicant(Long id) {
        ApplicantEntity applicantEntity = getApplicantById(id);
        applicantEntity.setDeletedAt(LocalDateTime.now());
        applicantRepository.save(applicantEntity);
    }

    @Scheduled(cron = "${app.applicant.soft-delete-purge-cron:0 0 3 * * *}")
    @Transactional
    public void purgeSoftDeletedApplicants() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(30);
        int deleted = applicantRepository.deleteAllSoftDeletedBefore(threshold);
        if (deleted > 0) {
            log.info("Purged {} soft-deleted applicants older than 30 days", deleted);
        }
    }

    @Transactional
    public ApplicantResponseDTO approveApplicant(ApproveApplicantDTO request, String reviewerUsername) {
        ApplicantEntity applicantEntity = getApplicantById(request.getApplicantId());
        ensurePending(applicantEntity);

        applicantEntity.setApproved(true);
        applicantEntity.setReviewed(true);
        applicantEntity.setReviewedBy(reviewerUsername);
        applicantEntity.setReviewedAt(LocalDateTime.now(resolveDashboardZone()));
        ApplicantEntity savedApplicantEntity = applicantRepository.save(applicantEntity);

        ApprovalNotificationDTO decisionNotification = ApprovalNotificationDTO.builder()
                .applicantEmail(savedApplicantEntity.getEmail())
                .applicantName(savedApplicantEntity.getFirstName() + " " + savedApplicantEntity.getLastName())
                .projectAppliedFor(savedApplicantEntity.getProjectAppliedFor())
                .approved(true)
                .adminMessage(request.getMessage())
                .build();
        emailService.sendDecisionNotification(decisionNotification);
        createDecisionNotifications(savedApplicantEntity, true, request.getMessage());

        log.info("Approved applicant id={} email={}", savedApplicantEntity.getId(), savedApplicantEntity.getEmail());
        return mapToResponse(savedApplicantEntity);
    }

    @Transactional
    public ApplicantResponseDTO denyApplicant(DenyApplicantDTO request, String reviewerUsername) {
        ApplicantEntity applicantEntity = getApplicantById(request.getApplicantId());
        ensurePending(applicantEntity);

        applicantEntity.setApproved(false);
        applicantEntity.setReviewed(true);
        applicantEntity.setReviewedBy(reviewerUsername);
        applicantEntity.setReviewedAt(LocalDateTime.now(resolveDashboardZone()));
        ApplicantEntity savedApplicantEntity = applicantRepository.save(applicantEntity);

        ApprovalNotificationDTO decisionNotification = ApprovalNotificationDTO.builder()
                .applicantEmail(savedApplicantEntity.getEmail())
                .applicantName(savedApplicantEntity.getFirstName() + " " + savedApplicantEntity.getLastName())
                .projectAppliedFor(savedApplicantEntity.getProjectAppliedFor())
                .approved(false)
                .adminMessage(request.getMessage())
                .build();
        emailService.sendDecisionNotification(decisionNotification);
        createDecisionNotifications(savedApplicantEntity, false, request.getMessage());

        log.info("Denied applicant id={} email={}", savedApplicantEntity.getId(), savedApplicantEntity.getEmail());
        return mapToResponse(savedApplicantEntity);
    }

    @Transactional(readOnly = true)
    public ApplicantsOverviewDTO getApplicantsOverview() {
        ZoneId zoneId = resolveDashboardZone();
        LocalDateTime now = LocalDateTime.now(zoneId);
        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime tomorrowStart = todayStart.plusDays(1);

        return ApplicantsOverviewDTO.builder()
                .todayNewApplicants(applicantRepository
                        .countByDeletedAtIsNullAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(todayStart, tomorrowStart))
                .pendingApplications(applicantRepository.countByDeletedAtIsNullAndReviewedFalse())
                .approvedApplications(applicantRepository.countByDeletedAtIsNullAndReviewedTrueAndApprovedTrue())
                .deniedApplications(applicantRepository.countByDeletedAtIsNullAndReviewedTrueAndApprovedFalse())
                .build();
    }

    @Transactional(readOnly = true)
    public SubmissionSeriesDTO getSubmissionRate(int days) {
        int boundedDays = Math.max(2, Math.min(days, 90));
        ZoneId zoneId = resolveDashboardZone();
        LocalDate toDate = LocalDate.now(zoneId).plusDays(1);
        LocalDate fromDate = toDate.minusDays(boundedDays);

        return buildSeries(fromDate, toDate, "day");
    }

    @Transactional(readOnly = true)
    public SubmissionSeriesDTO getMonthlySubmissions(LocalDate from, LocalDate to, String month, String granularity) {
        ZoneId zoneId = resolveDashboardZone();

        LocalDate resolvedFrom;
        LocalDate resolvedToExclusive;
        if (month != null && !month.isBlank()) {
            YearMonth yearMonth = YearMonth.parse(month);
            resolvedFrom = yearMonth.atDay(1);
            resolvedToExclusive = yearMonth.plusMonths(1).atDay(1);
        } else {
            LocalDate defaultTo = LocalDate.now(zoneId).plusDays(1);
            LocalDate defaultFrom = defaultTo.minusDays(30);
            resolvedFrom = from == null ? defaultFrom : from;
            resolvedToExclusive = to == null ? defaultTo : to.plusDays(1);
        }

        if (!resolvedFrom.isBefore(resolvedToExclusive)) {
            throw new BadRequestException("Invalid date range. 'from' must be before 'to'.");
        }

        String resolvedGranularity = normalizeGranularity(granularity);
        return buildSeries(resolvedFrom, resolvedToExclusive, resolvedGranularity);
    }

    @Transactional(readOnly = true)
    public AdminPerformanceDTO getAdminPerformance(String username) {
        String reviewer = username == null ? "" : username.trim();
        if (reviewer.isEmpty()) {
            throw new BadRequestException("Reviewer username is required");
        }

        long approved = applicantRepository
                .countByDeletedAtIsNullAndReviewedTrueAndReviewedByIgnoreCaseAndApprovedTrue(reviewer);
        long denied = applicantRepository
                .countByDeletedAtIsNullAndReviewedTrueAndReviewedByIgnoreCaseAndApprovedFalse(reviewer);

        return AdminPerformanceDTO.builder()
                .adminUsername(reviewer)
                .approvedCount(approved)
                .deniedCount(denied)
                .totalReviewed(approved + denied)
                .build();
    }

    private ApplicantEntity getApplicantById(Long id) {
        ApplicantEntity applicantEntity = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ApplicantEntity not found with id: " + id));

        if (applicantEntity.getDeletedAt() != null) {
            throw new ResourceNotFoundException("ApplicantEntity not found with id: " + id);
        }

        return applicantEntity;
    }

    private void ensurePending(ApplicantEntity applicantEntity) {
        if (applicantEntity.isReviewed()) {
            log.warn("Applicant already processed id={} approved={}", applicantEntity.getId(), applicantEntity.isApproved());
            throw new BadRequestException("Applicant has already been processed");
        }
    }

    private void ensureEmailAvailable(String email, Long excludeApplicantId) {
        if (!isEmailAvailable(email, excludeApplicantId)) {
            throw new BadRequestException("Email has already been used");
        }
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim();
    }

    private ApplicantResponseDTO mapToResponse(ApplicantEntity applicantEntity) {
        return ApplicantResponseDTO.builder()
                .id(applicantEntity.getId())
                .firstName(applicantEntity.getFirstName())
                .lastName(applicantEntity.getLastName())
                .age(applicantEntity.getAge())
                .email(applicantEntity.getEmail())
                .degree(applicantEntity.getDegree())
                .projectAppliedFor(applicantEntity.getProjectAppliedFor())
                .experience(applicantEntity.getExperience())
                .resumePath(applicantEntity.getResumePath())
                .approved(applicantEntity.isApproved())
                .reviewed(applicantEntity.isReviewed())
                .createdAt(applicantEntity.getCreatedAt())
                .updatedAt(applicantEntity.getUpdatedAt())
                .build();
    }

    private void createDecisionNotifications(ApplicantEntity applicantEntity, boolean approved, String customMessage) {
        try {
            NotificationTypeEnum type = approved ? NotificationTypeEnum.APPROVAL : NotificationTypeEnum.REJECTION;
            String decision = approved ? "approved" : "denied";
            String normalizedMessage = normalizeDecisionMessage(customMessage);

            Optional<UserEntity> applicantUserOptional = userRepository.findByEmail(applicantEntity.getEmail());
            applicantUserOptional.ifPresent(recipient -> {
                NotificationEntity applicantNotification = NotificationEntity.builder()
                        .title("Application " + (approved ? "Approved" : "Denied"))
                        .message("Your application for " + applicantEntity.getProjectAppliedFor() + " was " + decision
                                + ". " + normalizedMessage)
                        .type(type)
                        .recipient(recipient)
                        .isRead(false)
                        .build();
                notificationService.createNotificationInternal(applicantNotification);
            });

            if (applicantUserOptional.isEmpty()) {
                log.info("Skipping applicant in-app notification because no user account exists for email={}",
                        applicantEntity.getEmail());
            }

            List<UserEntity> admins = userRepository.findAllByRole(UserRoleEnum.ADMIN);
            for (UserEntity adminUser : admins) {
                NotificationEntity adminNotification = NotificationEntity.builder()
                        .title("Applicant " + (approved ? "Approved" : "Denied"))
                        .message("Applicant " + applicantEntity.getFirstName() + " " + applicantEntity.getLastName()
                                + " was " + decision + " for " + applicantEntity.getProjectAppliedFor() + ".")
                        .type(type)
                        .recipient(adminUser)
                        .isRead(false)
                        .build();
                notificationService.createNotificationInternal(adminNotification);
            }
        } catch (Exception ex) {
            log.error("Failed to create in-app decision notifications for applicant id={}", applicantEntity.getId(), ex);
        }
    }

    private String normalizeDecisionMessage(String customMessage) {
        String message = customMessage == null ? "" : customMessage.trim();
        return message.isEmpty() ? "" : "Message: " + message;
    }

    private ZoneId resolveDashboardZone() {
        try {
            return ZoneId.of(dashboardZoneId);
        } catch (Exception ex) {
            return ZoneId.of("UTC");
        }
    }

    private String normalizeGranularity(String granularity) {
        if (granularity == null || granularity.isBlank()) {
            return "day";
        }

        String normalized = granularity.trim().toLowerCase(Locale.ROOT);
        if (!List.of("day", "week", "month").contains(normalized)) {
            throw new BadRequestException("Unsupported granularity. Use day, week, or month.");
        }
        return normalized;
    }

    private SubmissionSeriesDTO buildSeries(LocalDate from, LocalDate toExclusive, String granularity) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = toExclusive.atStartOfDay();

        Map<LocalDate, Long> dailyCounts = new HashMap<>();
        for (Object[] row : applicantRepository.countDailySubmissionsBetween(fromDateTime, toDateTime)) {
            Object dateRaw = row[0];
            LocalDate date = dateRaw instanceof LocalDate
                    ? (LocalDate) dateRaw
                    : ((java.sql.Date) dateRaw).toLocalDate();
            Number countRaw = (Number) row[1];
            long count = countRaw == null ? 0L : countRaw.longValue();
            dailyCounts.put(date, count);
        }

        List<SubmissionPointDTO> points = switch (granularity) {
            case "week" -> buildWeeklyPoints(from, toExclusive, dailyCounts);
            case "month" -> buildMonthlyPoints(from, toExclusive, dailyCounts);
            default -> buildDailyPoints(from, toExclusive, dailyCounts);
        };

        long total = points.stream().mapToLong(SubmissionPointDTO::submissions).sum();

        return SubmissionSeriesDTO.builder()
                .from(from.toString())
                .to(toExclusive.minusDays(1).toString())
                .totalSubmissions(total)
                .points(points)
                .build();
    }

    private List<SubmissionPointDTO> buildDailyPoints(LocalDate from, LocalDate toExclusive, Map<LocalDate, Long> dailyCounts) {
        List<SubmissionPointDTO> points = new ArrayList<>();
        long previous = 0;
        boolean hasPrevious = false;

        for (LocalDate cursor = from; cursor.isBefore(toExclusive); cursor = cursor.plusDays(1)) {
            long count = dailyCounts.getOrDefault(cursor, 0L);
            points.add(SubmissionPointDTO.builder()
                    .label(cursor.toString())
                    .submissions(count)
                    .changePercent(calculateChangePercent(previous, count, hasPrevious))
                    .build());
            previous = count;
            hasPrevious = true;
        }

        return points;
    }

    private List<SubmissionPointDTO> buildWeeklyPoints(LocalDate from, LocalDate toExclusive, Map<LocalDate, Long> dailyCounts) {
        WeekFields weekFields = WeekFields.ISO;
        Map<String, Long> grouped = new HashMap<>();

        for (LocalDate cursor = from; cursor.isBefore(toExclusive); cursor = cursor.plusDays(1)) {
            int weekNumber = cursor.get(weekFields.weekOfWeekBasedYear());
            int weekYear = cursor.get(weekFields.weekBasedYear());
            String key = weekYear + "-W" + String.format(Locale.ROOT, "%02d", weekNumber);
            grouped.merge(key, dailyCounts.getOrDefault(cursor, 0L), Long::sum);
        }

        return buildFromGroupedMap(grouped);
    }

    private List<SubmissionPointDTO> buildMonthlyPoints(LocalDate from, LocalDate toExclusive, Map<LocalDate, Long> dailyCounts) {
        Map<String, Long> grouped = new HashMap<>();

        for (LocalDate cursor = from; cursor.isBefore(toExclusive); cursor = cursor.plusDays(1)) {
            String key = YearMonth.from(cursor).toString();
            grouped.merge(key, dailyCounts.getOrDefault(cursor, 0L), Long::sum);
        }

        return buildFromGroupedMap(grouped);
    }

    private List<SubmissionPointDTO> buildFromGroupedMap(Map<String, Long> grouped) {
        List<Map.Entry<String, Long>> entries = new ArrayList<>(grouped.entrySet());
        entries.sort(Comparator.comparing(Map.Entry::getKey));

        List<SubmissionPointDTO> points = new ArrayList<>();
        long previous = 0;
        boolean hasPrevious = false;
        for (Map.Entry<String, Long> entry : entries) {
            long count = entry.getValue();
            points.add(SubmissionPointDTO.builder()
                    .label(entry.getKey())
                    .submissions(count)
                    .changePercent(calculateChangePercent(previous, count, hasPrevious))
                    .build());
            previous = count;
            hasPrevious = true;
        }
        return points;
    }

    private Double calculateChangePercent(long previousValue, long currentValue, boolean hasPrevious) {
        if (!hasPrevious) {
            return null;
        }
        if (previousValue == 0) {
            return currentValue == 0 ? 0.0 : 100.0;
        }

        double raw = ((double) (currentValue - previousValue) / previousValue) * 100;
        return BigDecimal.valueOf(raw).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
