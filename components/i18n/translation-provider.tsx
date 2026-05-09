"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "en" | "vi";

type TranslationValues = Record<string, string | number>;

type TranslationOptions = {
  fallback?: string;
  values?: TranslationValues;
};

const enTranslations = {
  "language.label": "Language",
  "language.english": "English",
  "language.vietnamese": "Vietnamese",

  "nav.home": "Home",
  "nav.drugInfo": "Drug Info",
  "nav.drugInteraction": "Drug Interaction",
  "nav.prescription": "Prescription",
  "nav.chatbot": "AI Assistant",
  "nav.signIn": "Sign in",
  "nav.register": "Register",
  "nav.signOut": "Sign out",
  "role.admin": "Admin",
  "role.user": "User",
  "role.med": "Medical",

  "actions.search": "Search",
  "actions.readMore": "Read More",
  "actions.launchTool": "Launch Tool",
  "actions.viewDetails": "View details",
  "actions.clearFilters": "Clear filters",
  "actions.clearSearch": "Clear search",
  "actions.cancel": "Cancel",
  "actions.continueAnyway": "Continue Anyway",
  "actions.close": "Close",

  "footer.quickLinks": "Quick Links",
  "footer.legal": "Legal",
  "footer.drugInformation": "Drug Information",
  "footer.healthConditions": "Health Conditions",
  "footer.medicalNews": "Medical News",
  "footer.healthTools": "Health Tools",
  "footer.drugInteractions": "Drug Interactions",
  "footer.privacyPolicy": "Privacy Policy",
  "footer.termsOfUse": "Terms of Use",
  "footer.aboutUs": "About Us",
  "footer.contact": "Contact",
  "footer.disclaimer": "Disclaimer",
  "footer.description":
    "Your trusted source for accurate, up-to-date medical and pharmaceutical information. Always consult healthcare professionals for medical advice.",
  "footer.allRights": "All rights reserved.",
  "footer.address": "221B Health Avenue, Suite 12, Boston, MA",
  "footer.phone": "+1 (800) 555-1024",
  "footer.email": "support@analyticspill.com",

  "home.trustTagline": "Trusted • Accurate • Up-to-date",
  "home.heroTitle": "Your trusted medical intelligence hub",
  "home.heroSubtitle":
    "Search medications, interactions, and tools from a single clinical-grade workspace built for clarity.",
  "home.heroChip.monographs": "Drug monographs",
  "home.heroChip.interactionAlerts": "Interaction alerts",
  "home.heroChip.clinicalTools": "Clinical tools",
  "home.searchPlaceholder": "Search for medications, interactions, or tools...",
  "home.actions.drugInfo": "Drug Info",
  "home.actions.interactions": "Interactions",
  "home.actions.pillId": "Pill ID",
  "home.actions.healthTools": "Health Tools",
  "home.whyTagline": "Why clinicians choose us",
  "home.whyTitle": "Clinical-grade insights for everyone",
  "home.whyDescription":
    "Daily-updated content, pharmacist review, and workflow-friendly tools keep every care decision aligned.",
  "home.ctaResources": "Explore our resources",
  "home.categoriesTitle": "Popular categories",
  "home.categoriesDescription":
    "Quick access to the most searched medical information curated by our clinical experts.",
  "home.newsTitle": "Latest medical news",
  "home.newsDescription":
    "Stay updated with the latest healthcare developments and regulatory alerts.",
  "home.newsViewAll": "View all →",
  "home.toolsTitle": "Medical tools & resources",
  "home.toolsDescription":
    "Essential tools for medication management, dosage calculations, and interaction checks.",

  "category.topMedications.title": "Top Medications",
  "category.topMedications.description":
    "Most prescribed and researched medications with clinical guidance and patient tips.",
  "category.topMedications.cta": "Browse",
  "category.healthConditions.title": "Health Conditions",
  "category.healthConditions.description":
    "Evidence-based summaries covering symptoms, diagnostics, and treatment pathways.",
  "category.healthConditions.cta": "Explore",
  "category.drugInteractions.title": "Drug Interactions",
  "category.drugInteractions.description":
    "Check for medication conflicts, contraindications, and clinical monitoring guidance.",
  "category.drugInteractions.cta": "Check",
  "category.healthGuides.title": "Health Guides",
  "category.healthGuides.description":
    "Expert-written guides to support treatment adherence and lifestyle recommendations.",
  "category.healthGuides.cta": "Read",

  "feature.clinicalAccuracy.title": "Clinical Accuracy",
  "feature.clinicalAccuracy.description":
    "Reviewed by pharmacists and physicians with daily data refreshes from FDA and EMA resources.",
  "feature.personalizedExperience.title": "Personalized Experience",
  "feature.personalizedExperience.description":
    "Bookmark medications, set reminders, and tailor dashboards with patient or provider modes.",
  "feature.decisionSupport.title": "Decision Support",
  "feature.decisionSupport.description":
    "Smart calculators, risk scores, and alerts designed to support confident clinical decisions.",

  "news.breakthroughCancer.title":
    "New Breakthrough in Cancer Treatment Shows Promise",
  "news.breakthroughCancer.description":
    "Researchers have identified a targeted therapy that significantly improves remission rates in aggressive solid tumors.",
  "news.breakthroughCancer.tag": "Research",
  "news.breakthroughCancer.time": "2 hours ago",
  "news.fdaDiabetes.title": "FDA Approves New Diabetes Medication",
  "news.fdaDiabetes.description":
    "A once-weekly injection for type 2 diabetes has received approval after demonstrating durable glucose control.",
  "news.fdaDiabetes.tag": "Healthcare",
  "news.fdaDiabetes.time": "5 hours ago",
  "news.drugRecall.title": "Important Drug Recall Notice Issued",
  "news.drugRecall.description":
    "The FDA has issued a recall for specific blood pressure medications due to potential contamination concerns.",
  "news.drugRecall.tag": "Drug Safety",
  "news.drugRecall.time": "1 day ago",

  "tools.pillIdentifier.title": "Pill Identifier",
  "tools.pillIdentifier.description":
    "Identify medications by color, shape, and imprint codes with detailed references.",
  "tools.interactionChecker.title": "Interaction Checker",
  "tools.interactionChecker.description":
    "Quickly evaluate potential interactions between prescription and OTC medications.",
  "tools.dosageCalculator.title": "Dosage Calculator",
  "tools.dosageCalculator.description":
    "Calculate weight-based or renal-adjusted medication dosages with clinical safeguards.",
  "tools.labReference.title": "Lab Reference Ranges",
  "tools.labReference.description":
    "Search age-specific and condition-specific laboratory reference ranges instantly.",
  "tools.immunization.title": "Immunization Schedules",
  "tools.immunization.description":
    "Stay updated with CDC-recommended immunization schedules tailored for each age group.",
  "tools.symptomChecker.title": "Symptom Checker",
  "tools.symptomChecker.description":
    "Assess symptoms with evidence-backed decision trees and next-step guidance.",

  "drugsInfo.badge": "Drug Info",
  "drugsInfo.title": "Explore medications with confidence",
  "drugsInfo.description":
    "Find medications fast with live suggestions and lightweight filters for dosing or safety notes.",
  "drugsInfo.results": "Results",
  "drugsInfo.matchesFound": "{{count}} match{{suffix}} found",
  "drugsInfo.noMatchesTitle": "No matches found",
  "drugsInfo.noMatchesDescription": "Try a different keyword or clear filters.",
  "drugsInfo.emptyAction": "Try a different keyword or clear filters.",
  "drugsInfo.limitReached": "Limit reached",
  "drugsInfo.addDrugPrompt": "Add a drug to check",
  "drugsInfo.selectedCount": "{{selected}} selected / {{max}} limit",
  "drugsInfo.limitExceeded": "Limit exceeded, remove items.",
  "drugsInfo.removeItem": "Remove {{item}}",
  "drugsInfo.searchPlaceholder":
    "Search for drugs, categories, or compounds...",
  "drugsInfo.searchAria": "Drug search",
  "drugsInfo.fdaApproved": "FDA Approved",
  "drugsInfo.loading": "Loading...",
  "drugsInfo.pagination": "Page {{current}} of {{total}}",
  "drugsInfo.filterByCategory": "Filter by category",

  "actions.clear": "Clear",
  "actions.previous": "Previous",
  "actions.next": "Next",

  "drugInteraction.badge": "Drug Interaction",
  "drugInteraction.title": "Evaluate multi-drug interactions",
  "drugInteraction.description":
    "Select up to ten meds and instantly surface severity badges, risks, and quick recommendations.",
  "drugInteraction.selectPrompt":
    "Select 1–10 drugs to enable the checker. Current: {{count}}",
  "drugInteraction.checkButton": "Check interactions",
  "drugInteraction.results": "Results",
  "drugInteraction.interactionsFound": "{{count}} interactions found",
  "drugInteraction.addDrugs": "Add at least one drug to check interactions.",
  "drugInteraction.checking": "Checking mock interactions...",
  "drugInteraction.noInteractions":
    "No known interactions found between selected drugs.",
  "drugInteraction.ingredientInteractions": "Ingredient interactions",
  "drugInteraction.ingredientDescription":
    "Based on shared compounds with related medications.",
  "drugInteraction.ingredientLabel": "Ingredient: {{compound}}",
  "drugInteraction.severity.severe": "Severe",
  "drugInteraction.severity.moderate": "Moderate",
  "drugInteraction.severity.mild": "Mild",
  "drugInteraction.moreDetails": "More details",
  "drugInteraction.hideDetails": "Hide details",

  "interactionCard.effect": "Effect",

  "prescription.badge": "Prescription Workspace",
  "prescription.title": "Role-based prescription view",
  "prescription.description":
    "Switch between patient and pharmacist modes with inline interaction checks before anything is signed off.",
  "prescription.switchHint":
    "Switch perspectives to preview each workflow mode.",
  "prescription.createTitle": "Create prescription",
  "prescription.createDescription":
    "Add patient details and build a drug list. Interaction checks run before creation.",
  "prescription.patientName": "Patient name",
  "prescription.patientName.placeholder": "e.g., Jordan Smith",
  "prescription.dob": "Date of birth",
  "prescription.patientId": "Patient ID",
  "prescription.patientId.placeholder": "Optional ID",
  "prescription.quickAdd": "Quick add",
  "prescription.interactionPreview": "Interaction preview",
  "prescription.alertsDetected": "Potential alerts detected.",
  "prescription.noAlerts": "No alerts yet. A full check runs on submission.",
  "prescription.alertCount": "{{count}} alert{{suffix}}",
  "prescription.submit": "Create Prescription",
  "prescription.mockLogicTitle": "Mock interaction logic",
  "prescription.mockLogicDescription":
    "Example pairs that will raise warnings during creation.",
  "prescription.successMessage":
    "Prescription created (mock). No data was persisted.",
  "prescription.modalTitle": "Interaction warnings detected",
  "prescription.modalDescription":
    "Review these interactions before finalizing the prescription.",
  "prescription.close": "Close",
  "prescription.modalNote":
    "Refill info and pharmacy contact are mock placeholders in this demo.",
  "prescription.role.patient": "Patient View",
  "prescription.role.pharmacist": "Pharmacist View",
  "prescription.refillInfo":
    "Refill info and pharmacy contact are mock placeholders in this demo.",
  "prescription.rxLabel": "Prescription {{id}}",
  "prescription.rxPrefix": "Rx",
  "prescription.status.active": "Active",
  "prescription.status.completed": "Completed",
  "prescription.status.expired": "Expired",
  "prescription.viewDetails": "View details",

  "drugBuilder.title": "Medications",
  "drugBuilder.addDrug": "Add drug",
  "drugBuilder.drug": "Drug",
  "drugBuilder.selectDrug": "Select a drug",
  "drugBuilder.quantity": "Quantity",
  "drugBuilder.dosage": "Dosage",
  "drugBuilder.dosage.placeholder": "e.g., 500mg",
  "drugBuilder.schedule": "Schedule",
  "drugBuilder.schedule.onceDaily": "Once daily",
  "drugBuilder.schedule.twiceDaily": "Twice daily",
  "drugBuilder.schedule.threeTimesDaily": "Three times daily",
  "drugBuilder.schedule.asNeeded": "As needed",
  "drugBuilder.schedule.everyOtherDay": "Every other day",
  "drugBuilder.removeMedication": "Remove medication",

  "interactionModal.continue": "Continue Anyway",

  "section.whatsInside": "What's inside",
  "section.whatsInsideDescription":
    "Evidence-backed insights curated by pharmacists, physicians, and clinical researchers.",
  "section.essentialHighlights": "Essential Highlights",
  "section.essentialHighlightsDescription":
    "Explore the core capabilities and resources available within this section.",
  "section.latestCoverage": "Latest Coverage",
  "section.latestCoverageDescription":
    "Breaking news and deep dives sourced from medical journals and agencies.",
  "section.viewArchive": "View Archive",
  "section.featuredTools": "Featured Tools",
  "section.featuredToolsDescription":
    "Launch interactive calculators, identifiers, and clinical workflow aids.",
  "section.inDepthResources": "In-depth Resources",
  "section.inDepthDescription":
    "Dive into curated resources designed to support clinicians, researchers, and informed patients.",
  "section.inDepthBody1":
    "Each entry is peer-reviewed and cross-referenced with authoritative sources including the FDA, EMA, WHO, and AHFS. Bookmark key references and receive notifications when new evidence emerges.",
  "section.inDepthBody2":
    "Customize your feed, export citations, and collaborate with colleagues to build a tailored knowledge base for your care teams.",
  "section.readyTitle": "Ready to explore deeper?",

  // Landing Page - Hero Section
  "landing.hero.tagline": "Trusted • Accurate • Up-to-date",
  "landing.hero.title": "Your Complete Medical Knowledge Hub",
  "landing.hero.subtitle": "Access comprehensive drug information, check interactions, manage prescriptions, and explore clinical tools — all in one place.",
  "landing.hero.searchPlaceholder": "Search medications, interactions, or tools...",
  "landing.hero.chip.drugs": "10,000+ Medications",
  "landing.hero.chip.interactions": "Interaction Alerts",
  "landing.hero.chip.tools": "Clinical Tools",
  "landing.hero.actions.drugSearch": "Drug Search",
  "landing.hero.actions.interactions": "Check Interactions",
  "landing.hero.actions.prescriptions": "Prescriptions",
  "landing.hero.actions.tools": "Health Tools",

  // Landing Page - Features Section
  "landing.features.tagline": "Why Choose Us",
  "landing.features.title": "Built for Healthcare Professionals & Patients",
  "landing.features.description": "Our platform combines clinical-grade accuracy with user-friendly design to deliver trusted medical information.",
  "landing.features.drugDatabase.title": "Comprehensive Drug Database",
  "landing.features.drugDatabase.description": "Access detailed information on thousands of medications including dosing, side effects, and contraindications.",
  "landing.features.interactionChecker.title": "Drug Interaction Checker",
  "landing.features.interactionChecker.description": "Instantly identify potentially dangerous drug combinations with severity ratings and clinical guidance.",
  "landing.features.prescriptions.title": "Digital Prescriptions",
  "landing.features.prescriptions.description": "Create, manage, and track prescriptions digitally with built-in interaction checks before signing.",
  "landing.features.pillIdentifier.title": "Pill Identifier",
  "landing.features.pillIdentifier.description": "Identify unknown medications by color, shape, and imprint with high-accuracy visual matching.",
  "landing.features.healthInfo.title": "Health Information",
  "landing.features.healthInfo.description": "Access trusted health guides and condition-specific resources reviewed by medical professionals.",
  "landing.features.clinicalTools.title": "Clinical Tools",
  "landing.features.clinicalTools.description": "Dosage calculators, lab references, immunization schedules, and more workflow-ready tools.",

  // Landing Page - Services Section
  "landing.services.tagline": "Our Services",
  "landing.services.title": "Everything You Need for Medication Safety",
  "landing.services.description": "Explore our comprehensive suite of tools designed to support informed healthcare decisions.",
  "landing.services.explore": "Explore",
  "landing.services.drugSearch.title": "Drug Information",
  "landing.services.drugSearch.description": "Search and explore detailed medication profiles with clinical dosing and safety data.",
  "landing.services.interactions.title": "Interaction Checker",
  "landing.services.interactions.description": "Check for drug-drug interactions and receive severity-based recommendations.",
  "landing.services.prescriptions.title": "Prescription Management",
  "landing.services.prescriptions.description": "Create and manage digital prescriptions with automatic safety checks.",
  "landing.services.pillId.title": "Pill Identifier",
  "landing.services.pillId.description": "Identify medications visually using color, shape, and imprint codes.",
  "landing.services.tools.title": "Clinical Tools",
  "landing.services.tools.description": "Access dosage calculators, lab references, and clinical decision support tools.",
  "landing.services.guides.title": "Health Guides",
  "landing.services.guides.description": "Read expert-written guides on conditions, treatments, and lifestyle recommendations.",

  // Landing Page - Stats Section
  "landing.stats.title": "Trusted by Healthcare Professionals",
  "landing.stats.description": "Our platform powers medication safety decisions across the healthcare spectrum.",
  "landing.stats.drugs": "Medications in Database",
  "landing.stats.interactions": "Interaction Checks",
  "landing.stats.users": "Active Users",
  "landing.stats.prescriptions": "Prescriptions Managed",

  // Landing Page - How It Works Section
  "landing.howItWorks.tagline": "How It Works",
  "landing.howItWorks.title": "Get Started in Three Simple Steps",
  "landing.howItWorks.description": "Our intuitive platform makes medication safety accessible to everyone.",
  "landing.howItWorks.step1.title": "Search for Medications",
  "landing.howItWorks.step1.description": "Enter a drug name to access comprehensive information including dosing, side effects, and clinical guidance.",
  "landing.howItWorks.step2.title": "Check Drug Interactions",
  "landing.howItWorks.step2.description": "Add multiple medications to identify potential interactions with severity levels and management recommendations.",
  "landing.howItWorks.step3.title": "Manage Your Health Records",
  "landing.howItWorks.step3.description": "Create digital prescriptions, save medication lists, and track your health information securely.",

  // Landing Page - CTA Section
  "landing.cta.badge": "Start Today",
  "landing.cta.title": "Ready to Make Better Medication Decisions?",
  "landing.cta.description": "Join thousands of healthcare professionals and patients who trust our platform for medication safety and health information.",
  "landing.cta.primaryButton": "Create Free Account",
  "landing.cta.secondaryButton": "Explore Drugs",

  // Account Pages
  "account.settings": "Account Settings",
  "account.nav.overview": "Overview",
  "account.nav.overview.description": "View your account information",
  "account.nav.editProfile": "Edit Profile",
  "account.nav.editProfile.description": "Update your personal information",
  "account.nav.security": "Security",
  "account.nav.security.description": "Change password and security settings",
  "account.nav.avatar": "Avatar",
  "account.nav.avatar.description": "Update your profile picture",

  // Account Overview
  "account.overview.title": "Account Overview",
  "account.overview.description": "View your account information and manage settings",
  "account.overview.quickActions": "Quick Actions",
  "account.overview.accountDetails": "Account Details",
  "account.overview.editProfile": "Edit Profile",
  "account.overview.editProfile.description": "Update your name and username",
  "account.overview.changePassword": "Change Password",
  "account.overview.changePassword.description": "Update your security credentials",
  "account.overview.updateAvatar": "Update Avatar",
  "account.overview.updateAvatar.description": "Change your profile picture",
  "account.overview.username": "Username",
  "account.overview.email": "Email",
  "account.overview.firstName": "First Name",
  "account.overview.lastName": "Last Name",
  "account.overview.role": "Role",
  "account.overview.accountId": "Account ID",

  // Edit Profile
  "account.editProfile.title": "Edit Profile",
  "account.editProfile.description": "Update your personal information",
  "account.editProfile.backToAccount": "Back to Account",
  "account.editProfile.username": "Username",
  "account.editProfile.username.placeholder": "johndoe",
  "account.editProfile.username.description": "Your unique username. Must be 5-20 characters.",
  "account.editProfile.firstName": "First Name",
  "account.editProfile.firstName.placeholder": "John",
  "account.editProfile.firstName.description": "Letters only, no spaces or numbers.",
  "account.editProfile.lastName": "Last Name",
  "account.editProfile.lastName.placeholder": "Doe",
  "account.editProfile.lastName.description": "Your family name.",
  "account.editProfile.email": "Email",
  "account.editProfile.email.readOnly": "Email cannot be changed.",
  "account.editProfile.saveChanges": "Save Changes",
  "account.editProfile.saving": "Saving...",
  "account.editProfile.cancel": "Cancel",
  "account.editProfile.success": "Profile updated successfully! Redirecting...",
  "account.editProfile.error": "Failed to update profile.",

  // Security
  "account.security.title": "Security Settings",
  "account.security.description": "Manage your password and security preferences",
  "account.security.changePassword": "Change Password",
  "account.security.changePassword.description": "Update your password to keep your account secure",
  "account.security.currentPassword": "Current Password",
  "account.security.currentPassword.placeholder": "Enter your current password",
  "account.security.newPassword": "New Password",
  "account.security.newPassword.placeholder": "Enter your new password",
  "account.security.newPassword.description": "Password must be 6-20 characters long.",
  "account.security.confirmPassword": "Confirm New Password",
  "account.security.confirmPassword.placeholder": "Re-enter your new password",
  "account.security.updatePassword": "Update Password",
  "account.security.updating": "Updating...",
  "account.security.reset": "Reset",
  "account.security.success": "Password changed successfully!",
  "account.security.error": "Failed to change password.",

  // Avatar
  "account.avatar.title": "Profile Picture",
  "account.avatar.description": "Upload a new avatar to personalize your profile",
  "account.avatar.currentAvatar": "Current Avatar",
  "account.avatar.uploadNew": "Upload New Avatar",
  "account.avatar.supportedFormats": "Supported formats: JPG, PNG, GIF (max 5MB)",
  "account.avatar.preview": "Preview",
  "account.avatar.previewDescription": "This is how your new avatar will look",
  "account.avatar.uploadAvatar": "Upload Avatar",
  "account.avatar.uploading": "Uploading...",
  "account.avatar.cancel": "Cancel",
  "account.avatar.dragDrop": "Click or drag to upload",
  "account.avatar.dropHere": "Drop your image here",
  "account.avatar.fileSizeLimit": "JPG, PNG or GIF up to 5MB",
  "account.avatar.success": "Avatar updated successfully!",
  "account.avatar.error": "Failed to upload avatar.",
  "account.avatar.invalidType": "Please select an image file",
  "account.avatar.fileTooLarge": "File size must be less than 5MB",
} as const;

type TranslationKey = keyof typeof enTranslations;

const viTranslations: { [K in TranslationKey]: string } = {
  "language.label": "Ngôn ngữ",
  "language.english": "Tiếng Anh",
  "language.vietnamese": "Tiếng Việt",

  "nav.home": "Trang chủ",
  "nav.drugInfo": "Thông tin thuốc",
  "nav.drugInteraction": "Tương tác thuốc",
  "nav.prescription": "Đơn thuốc",
  "nav.chatbot": "Bác sĩ AI",
  "nav.signIn": "Đăng nhập",
  "nav.register": "Đăng ký",
  "nav.signOut": "Đăng xuất",
  "role.admin": "Quản trị",
  "role.user": "Thành viên",
  "role.med": "Chuyên gia",

  "actions.search": "Tìm kiếm",
  "actions.readMore": "Đọc thêm",
  "actions.launchTool": "Mở công cụ",
  "actions.viewDetails": "Xem chi tiết",
  "actions.clearFilters": "Xóa bộ lọc",
  "actions.clearSearch": "Xóa tìm kiếm",
  "actions.cancel": "Hủy",
  "actions.continueAnyway": "Tiếp tục",
  "actions.close": "Đóng",

  "footer.quickLinks": "Liên kết nhanh",
  "footer.legal": "Pháp lý",
  "footer.drugInformation": "Thông tin thuốc",
  "footer.healthConditions": "Tình trạng sức khỏe",
  "footer.medicalNews": "Tin y tế",
  "footer.healthTools": "Công cụ sức khỏe",
  "footer.drugInteractions": "Tương tác thuốc",
  "footer.privacyPolicy": "Chính sách bảo mật",
  "footer.termsOfUse": "Điều khoản sử dụng",
  "footer.aboutUs": "Về chúng tôi",
  "footer.contact": "Liên hệ",
  "footer.disclaimer": "Miễn trừ trách nhiệm",
  "footer.description":
    "Nguồn thông tin y khoa chính xác, cập nhật. Không thay thế cho tư vấn, chẩn đoán hay điều trị y khoa. Luôn hỏi ý kiến bác sĩ hoặc dược sĩ trước khi quyết định điều trị.",
  "footer.allRights": "Bảo lưu mọi quyền.",
  "footer.address": "221B Health Avenue, Tầng 12, Boston, MA",
  "footer.phone": "+1 (800) 555-1024",
  "footer.email": "support@analyticspill.com",

  "home.trustTagline": "Tin cậy • Chính xác • Cập nhật",
  "home.heroTitle": "Trung tâm tri thức y khoa tin cậy",
  "home.heroSubtitle":
    "Tra cứu thuốc, tương tác và các công cụ lâm sàng trong một không gian làm việc chuẩn lâm sàng, dễ theo dõi.",
  "home.heroChip.monographs": "Hồ sơ thuốc",
  "home.heroChip.interactionAlerts": "Cảnh báo tương tác",
  "home.heroChip.clinicalTools": "Công cụ lâm sàng",
  "home.searchPlaceholder": "Tìm thuốc, tương tác hoặc công cụ...",
  "home.actions.drugInfo": "Thông tin thuốc",
  "home.actions.interactions": "Tương tác",
  "home.actions.pillId": "Nhận dạng viên",
  "home.actions.healthTools": "Công cụ sức khỏe",
  "home.whyTagline": "Vì sao chuyên gia tin dùng",
  "home.whyTitle": "Thông tin chuẩn lâm sàng cho mọi đối tượng",
  "home.whyDescription":
    "Nội dung cập nhật hằng ngày, được dược sĩ và bác sĩ kiểm duyệt, tối ưu cho quy trình chăm sóc người bệnh.",
  "home.ctaResources": "Khám phá tài nguyên",
  "home.categoriesTitle": "Danh mục phổ biến",
  "home.categoriesDescription":
    "Truy cập nhanh các nhóm thông tin y khoa được đội ngũ chuyên môn chọn lọc.",
  "home.newsTitle": "Tin y khoa mới nhất",
  "home.newsDescription":
    "Bám sát diễn biến y tế và các cảnh báo dược – y khoa quan trọng.",
  "home.newsViewAll": "Xem tất cả →",
  "home.toolsTitle": "Công cụ & tài nguyên y khoa",
  "home.toolsDescription":
    "Các công cụ thiết yếu cho quản lý thuốc, tính liều và kiểm tra tương tác.",

  "category.topMedications.title": "Thuốc nổi bật",
  "category.topMedications.description":
    "Các thuốc được kê đơn/quan tâm nhiều nhất kèm hướng dẫn lâm sàng và lưu ý cho bệnh nhân.",
  "category.topMedications.cta": "Xem",
  "category.healthConditions.title": "Tình trạng sức khỏe",
  "category.healthConditions.description":
    "Tóm tắt dựa trên bằng chứng về triệu chứng, chẩn đoán và phác đồ điều trị.",
  "category.healthConditions.cta": "Khám phá",
  "category.drugInteractions.title": "Tương tác thuốc",
  "category.drugInteractions.description":
    "Kiểm tra xung đột thuốc, chống chỉ định và hướng dẫn theo dõi lâm sàng.",
  "category.drugInteractions.cta": "Kiểm tra",
  "category.healthGuides.title": "Hướng dẫn sức khỏe",
  "category.healthGuides.description":
    "Bài viết từ chuyên gia hỗ trợ tuân thủ điều trị và thay đổi lối sống.",
  "category.healthGuides.cta": "Đọc",

  "feature.clinicalAccuracy.title": "Độ chính xác lâm sàng",
  "feature.clinicalAccuracy.description":
    "Được dược sĩ và bác sĩ thẩm định, cập nhật dữ liệu hằng ngày từ các nguồn như FDA và EMA.",
  "feature.personalizedExperience.title": "Trải nghiệm cá nhân hóa",
  "feature.personalizedExperience.description":
    "Lưu thuốc, đặt nhắc nhở và tùy chỉnh bảng điều khiển theo vai trò bệnh nhân hoặc nhân viên y tế.",
  "feature.decisionSupport.title": "Hỗ trợ quyết định",
  "feature.decisionSupport.description":
    "Máy tính, thang điểm nguy cơ và cảnh báo được thiết kế để hỗ trợ quyết định lâm sàng tự tin.",

  "news.breakthroughCancer.title":
    "Đột phá mới đầy hứa hẹn trong điều trị ung thư",
  "news.breakthroughCancer.description":
    "Một liệu pháp nhắm trúng đích mới giúp cải thiện rõ rệt tỷ lệ lui bệnh ở các khối u đặc tiến triển.",
  "news.breakthroughCancer.tag": "Nghiên cứu",
  "news.breakthroughCancer.time": "2 giờ trước",
  "news.fdaDiabetes.title": "FDA phê duyệt thuốc điều trị đái tháo đường mới",
  "news.fdaDiabetes.description":
    "Thuốc tiêm tuần một lần cho đái tháo đường type 2 được phê duyệt nhờ khả năng kiểm soát đường huyết bền vững.",
  "news.fdaDiabetes.tag": "Chăm sóc sức khỏe",
  "news.fdaDiabetes.time": "5 giờ trước",
  "news.drugRecall.title": "Thông báo thu hồi thuốc quan trọng",
  "news.drugRecall.description":
    "FDA thu hồi một số thuốc hạ huyết áp do nguy cơ nhiễm tạp chất.",
  "news.drugRecall.tag": "An toàn thuốc",
  "news.drugRecall.time": "1 ngày trước",

  "tools.pillIdentifier.title": "Nhận dạng viên thuốc",
  "tools.pillIdentifier.description":
    "Nhận diện thuốc theo màu sắc, hình dạng và ký hiệu, kèm thông tin tham khảo chi tiết.",
  "tools.interactionChecker.title": "Kiểm tra tương tác",
  "tools.interactionChecker.description":
    "Đánh giá nhanh tương tác giữa thuốc kê toa và thuốc không kê toa (OTC).",
  "tools.dosageCalculator.title": "Máy tính liều dùng",
  "tools.dosageCalculator.description":
    "Tính liều theo cân nặng hoặc chỉnh liều theo chức năng thận với các ngưỡng an toàn lâm sàng.",
  "tools.labReference.title": "Khoảng tham chiếu xét nghiệm",
  "tools.labReference.description":
    "Tra cứu nhanh khoảng tham chiếu xét nghiệm theo lứa tuổi và tình trạng bệnh lý.",
  "tools.immunization.title": "Lịch tiêm chủng",
  "tools.immunization.description":
    "Luôn cập nhật lịch tiêm chủng khuyến cáo (CDC) cho từng nhóm tuổi.",
  "tools.symptomChecker.title": "Kiểm tra triệu chứng",
  "tools.symptomChecker.description":
    "Đánh giá triệu chứng dựa trên cây quyết định và gợi ý bước tiếp theo phù hợp.",

  "drugsInfo.badge": "Thông tin thuốc",
  "drugsInfo.title": "Tra cứu thuốc an toàn & tin cậy",
  "drugsInfo.description":
    "Tra cứu thông tin chi tiết về thuốc, hoạt chất và các nhóm bệnh lý với công cụ tìm kiếm thông minh.",
  "drugsInfo.results": "Kết quả",
  "drugsInfo.matchesFound": "Tìm thấy {{count}} kết quả",
  "drugsInfo.noMatchesTitle": "Không tìm thấy kết quả",
  "drugsInfo.noMatchesDescription":
    "Thử từ khóa khác hoặc xóa bộ lọc đang dùng.",
  "drugsInfo.emptyAction": "Thử từ khóa khác hoặc xóa bộ lọc đang dùng.",
  "drugsInfo.limitReached": "Đã đạt giới hạn",
  "drugsInfo.addDrugPrompt": "Thêm thuốc để kiểm tra",
  "drugsInfo.selectedCount": "{{selected}} đã chọn / tối đa {{max}}",
  "drugsInfo.limitExceeded":
    "Đã vượt quá giới hạn thuốc cho phép, hãy bớt bớt thuốc trong danh sách.",
  "drugsInfo.removeItem": "Xóa {{item}}",
  "drugsInfo.searchPlaceholder": "Tìm thuốc, nhóm thuốc hoặc hoạt chất...",
  "drugsInfo.searchAria": "Tìm kiếm thuốc",
  "drugsInfo.fdaApproved": "Được FDA phê duyệt",
  "drugsInfo.loading": "Đang tải...",
  "drugsInfo.pagination": "Trang {{current}} / {{total}}",
  "drugsInfo.filterByCategory": "Lọc theo danh mục",

  "actions.clear": "Xóa",
  "actions.previous": "Trước",
  "actions.next": "Tiếp",

  "drugInteraction.badge": "Tương tác thuốc",
  "drugInteraction.title": "Đánh giá tương tác đa thuốc",
  "drugInteraction.description":
    "Chọn tối đa 10 thuốc và xem ngay mức độ nghiêm trọng, nguy cơ và gợi ý xử trí.",
  "drugInteraction.selectPrompt":
    "Chọn 1–10 thuốc để kích hoạt kiểm tra. Hiện đang chọn: {{count}}",
  "drugInteraction.checkButton": "Kiểm tra tương tác",
  "drugInteraction.results": "Kết quả",
  "drugInteraction.interactionsFound": "Tìm thấy {{count}} tương tác",
  "drugInteraction.addDrugs": "Thêm ít nhất một thuốc để kiểm tra tương tác.",
  "drugInteraction.checking": "Đang kiểm tra tương tác (giả lập)...",
  "drugInteraction.noInteractions":
    "Không phát hiện tương tác đã được biết giữa các thuốc đã chọn.",
  "drugInteraction.ingredientInteractions": "Tương tác theo thành phần",
  "drugInteraction.ingredientDescription":
    "Dựa trên thành phần chung và các thuốc có liên quan về cơ chế.",
  "drugInteraction.ingredientLabel": "Thành phần: {{compound}}",
  "drugInteraction.severity.severe": "Nặng",
  "drugInteraction.severity.moderate": "Trung bình",
  "drugInteraction.severity.mild": "Nhẹ",
  "drugInteraction.moreDetails": "Xem thêm",
  "drugInteraction.hideDetails": "Ẩn chi tiết",

  "interactionCard.effect": "Tác động",

  "prescription.badge": "Không gian làm việc kê đơn",
  "prescription.title": "Chế độ xem đơn thuốc theo từng vai trò",
  "prescription.description":
    "Chuyển giữa chế độ bệnh nhân và dược sĩ với kiểm tra tương tác tích hợp trước khi ký duyệt.",
  "prescription.switchHint":
    "Chuyển góc nhìn để xem quy trình của từng vai trò.",
  "prescription.createTitle": "Tạo đơn thuốc",
  "prescription.createDescription":
    "Nhập thông tin bệnh nhân và xây dựng danh sách thuốc. Hệ thống sẽ kiểm tra tương tác trước khi tạo.",
  "prescription.patientName": "Tên bệnh nhân",
  "prescription.patientName.placeholder": "vd: Nguyễn Minh",
  "prescription.dob": "Ngày sinh",
  "prescription.patientId": "Mã bệnh nhân",
  "prescription.patientId.placeholder": "Không bắt buộc",
  "prescription.quickAdd": "Thêm nhanh",
  "prescription.interactionPreview": "Xem trước tương tác",
  "prescription.alertsDetected": "Đã phát hiện cảnh báo tiềm ẩn.",
  "prescription.noAlerts":
    "Chưa có cảnh báo. Kiểm tra đầy đủ sẽ được thực hiện khi gửi đơn.",
  "prescription.alertCount": "{{count}} cảnh báo",
  "prescription.submit": "Tạo đơn thuốc",
  "prescription.mockLogicTitle": "Logic tương tác minh họa",
  "prescription.mockLogicDescription":
    "Các cặp thuốc ví dụ sẽ kích hoạt cảnh báo trong quá trình tạo đơn.",
  "prescription.successMessage":
    "Đã tạo đơn thuốc (giả lập). Không có dữ liệu thực tế nào được lưu.",
  "prescription.modalTitle": "Phát hiện cảnh báo tương tác",
  "prescription.modalDescription":
    "Xem xét các tương tác trước khi hoàn tất và ký duyệt đơn thuốc.",
  "prescription.close": "Đóng",
  "prescription.modalNote":
    "Thông tin tái cấp và liên hệ nhà thuốc chỉ là mô phỏng trong bản demo.",
  "prescription.role.patient": "Chế độ bệnh nhân",
  "prescription.role.pharmacist": "Chế độ dược sĩ",
  "prescription.refillInfo":
    "Thông tin tái cấp và liên hệ nhà thuốc chỉ là mô phỏng trong bản demo.",
  "prescription.rxLabel": "Đơn thuốc {{id}}",
  "prescription.rxPrefix": "Đơn",
  "prescription.status.active": "Đang hiệu lực",
  "prescription.status.completed": "Đã hoàn tất",
  "prescription.status.expired": "Hết hạn",
  "prescription.viewDetails": "Xem chi tiết",

  "drugBuilder.title": "Danh sách thuốc",
  "drugBuilder.addDrug": "Thêm thuốc",
  "drugBuilder.drug": "Thuốc",
  "drugBuilder.selectDrug": "Chọn thuốc",
  "drugBuilder.quantity": "Số lượng",
  "drugBuilder.dosage": "Liều dùng",
  "drugBuilder.dosage.placeholder": "vd: 500mg",
  "drugBuilder.schedule": "Lịch dùng",
  "drugBuilder.schedule.onceDaily": "Mỗi ngày một lần",
  "drugBuilder.schedule.twiceDaily": "Mỗi ngày hai lần",
  "drugBuilder.schedule.threeTimesDaily": "Ba lần mỗi ngày",
  "drugBuilder.schedule.asNeeded": "Khi cần",
  "drugBuilder.schedule.everyOtherDay": "Cách ngày",
  "drugBuilder.removeMedication": "Xóa thuốc",

  "interactionModal.continue": "Tiếp tục",

  "section.whatsInside": "Có gì bên trong",
  "section.whatsInsideDescription":
    "Nội dung dựa trên bằng chứng, được biên soạn bởi dược sĩ, bác sĩ và nhóm nghiên cứu lâm sàng.",
  "section.essentialHighlights": "Điểm nổi bật chính",
  "section.essentialHighlightsDescription":
    "Khám phá các tính năng và tài nguyên cốt lõi có trong mục này.",
  "section.latestCoverage": "Tin mới nhất",
  "section.latestCoverageDescription":
    "Tin nóng và phân tích chuyên sâu từ tạp chí y khoa và các cơ quan quản lý.",
  "section.viewArchive": "Xem lưu trữ",
  "section.featuredTools": "Công cụ nổi bật",
  "section.featuredToolsDescription":
    "Mở các máy tính lâm sàng, công cụ nhận dạng và trợ giúp quy trình chăm sóc tương tác.",
  "section.inDepthResources": "Tài nguyên chuyên sâu",
  "section.inDepthDescription":
    "Các tài nguyên được tuyển chọn nhằm hỗ trợ bác sĩ, nhà nghiên cứu và bệnh nhân có hiểu biết.",
  "section.inDepthBody1":
    "Mỗi nội dung đều được phản biện và đối chiếu với các nguồn uy tín như FDA, EMA, WHO và AHFS. Bạn có thể lưu các tài liệu quan trọng và nhận thông báo khi có bằng chứng mới.",
  "section.inDepthBody2":
    "Tùy chỉnh nguồn tin, xuất trích dẫn và cộng tác với đồng nghiệp để xây dựng kho tri thức riêng cho đội ngũ chăm sóc.",
  "section.readyTitle": "Sẵn sàng khám phá sâu hơn?",

  // Landing Page - Hero Section
  "landing.hero.tagline": "Tin cậy • Chính xác • Mới nhất",
  "landing.hero.title": "Tra Cứu Thuốc và Thông Tin Y Tế",
  "landing.hero.subtitle": "Truy cập thông tin thuốc đầy đủ, kiểm tra tương tác, quản lý đơn thuốc và khám phá các công cụ lâm sàng — tất cả trong một nơi.",
  "landing.hero.searchPlaceholder": "Tìm thuốc, tương tác hoặc công cụ...",
  "landing.hero.chip.drugs": "10.000+ Loại thuốc",
  "landing.hero.chip.interactions": "Cảnh báo tương tác",
  "landing.hero.chip.tools": "Công cụ lâm sàng",
  "landing.hero.actions.drugSearch": "Tìm thuốc",
  "landing.hero.actions.interactions": "Kiểm tra tương tác",
  "landing.hero.actions.prescriptions": "Đơn thuốc",
  "landing.hero.actions.tools": "Công cụ sức khỏe",

  // Landing Page - Features Section
  "landing.features.tagline": "Vì sao chọn chúng tôi",
  "landing.features.title": "Dành cho Chuyên gia Y tế và Bệnh nhân",
  "landing.features.description": "Nền tảng của chúng tôi kết hợp độ chính xác chuẩn lâm sàng với thiết kế thân thiện để cung cấp thông tin y khoa đáng tin cậy.",
  "landing.features.drugDatabase.title": "Cơ sở dữ liệu thuốc toàn diện",
  "landing.features.drugDatabase.description": "Truy cập thông tin chi tiết về hàng nghìn loại thuốc bao gồm liều dùng, tác dụng phụ và chống chỉ định.",
  "landing.features.interactionChecker.title": "Kiểm tra tương tác thuốc",
  "landing.features.interactionChecker.description": "Xác định ngay các phối hợp thuốc nguy hiểm tiềm ẩn với mức độ nghiêm trọng và hướng dẫn lâm sàng.",
  "landing.features.prescriptions.title": "Đơn thuốc điện tử",
  "landing.features.prescriptions.description": "Tạo, quản lý và theo dõi đơn thuốc điện tử với kiểm tra tương tác tích hợp trước khi ký.",
  "landing.features.pillIdentifier.title": "Nhận dạng viên thuốc",
  "landing.features.pillIdentifier.description": "Nhận diện thuốc không rõ nguồn gốc theo màu sắc, hình dạng và ký hiệu với độ chính xác cao.",
  "landing.features.healthInfo.title": "Thông tin sức khỏe",
  "landing.features.healthInfo.description": "Truy cập hướng dẫn sức khỏe đáng tin cậy và tài nguyên theo bệnh lý được chuyên gia y tế thẩm định.",
  "landing.features.clinicalTools.title": "Công cụ lâm sàng",
  "landing.features.clinicalTools.description": "Máy tính liều, khoảng tham chiếu xét nghiệm, lịch tiêm chủng và nhiều công cụ hữu ích khác.",

  // Landing Page - Services Section
  "landing.services.tagline": "Dịch vụ của chúng tôi",
  "landing.services.title": "Mọi thứ bạn cần để dùng thuốc an toàn",
  "landing.services.description": "Khám phá bộ công cụ toàn diện được thiết kế để hỗ trợ các quyết định chăm sóc sức khỏe có hiểu biết.",
  "landing.services.explore": "Khám phá",
  "landing.services.drugSearch.title": "Thông tin thuốc",
  "landing.services.drugSearch.description": "Tìm kiếm và khám phá hồ sơ thuốc chi tiết với liều dùng lâm sàng và dữ liệu an toàn.",
  "landing.services.interactions.title": "Kiểm tra tương tác",
  "landing.services.interactions.description": "Kiểm tra tương tác thuốc-thuốc và nhận khuyến cáo dựa trên mức độ nghiêm trọng.",
  "landing.services.prescriptions.title": "Quản lý đơn thuốc",
  "landing.services.prescriptions.description": "Tạo và quản lý đơn thuốc điện tử với kiểm tra an toàn tự động.",
  "landing.services.pillId.title": "Nhận dạng viên thuốc",
  "landing.services.pillId.description": "Nhận diện thuốc trực quan bằng màu sắc, hình dạng và mã ký hiệu.",
  "landing.services.tools.title": "Công cụ lâm sàng",
  "landing.services.tools.description": "Truy cập máy tính liều, khoảng tham chiếu xét nghiệm và các công cụ hỗ trợ quyết định lâm sàng.",
  "landing.services.guides.title": "Hướng dẫn sức khỏe",
  "landing.services.guides.description": "Đọc các hướng dẫn từ chuyên gia về bệnh lý, điều trị và khuyến cáo lối sống.",

  // Landing Page - Stats Section
  "landing.stats.title": "Được tin dùng bởi Chuyên gia Y tế",
  "landing.stats.description": "Nền tảng của chúng tôi hỗ trợ quyết định an toàn thuốc trên toàn bộ hệ thống chăm sóc sức khỏe.",
  "landing.stats.drugs": "Thuốc trong cơ sở dữ liệu",
  "landing.stats.interactions": "Kiểm tra tương tác",
  "landing.stats.users": "Người dùng hoạt động",
  "landing.stats.prescriptions": "Đơn thuốc được quản lý",

  // Landing Page - How It Works Section
  "landing.howItWorks.tagline": "Cách hoạt động",
  "landing.howItWorks.title": "Bắt đầu với Ba bước Đơn giản",
  "landing.howItWorks.description": "Nền tảng trực quan của chúng tôi giúp an toàn thuốc dễ tiếp cận với mọi người.",
  "landing.howItWorks.step1.title": "Tìm kiếm thuốc",
  "landing.howItWorks.step1.description": "Nhập tên thuốc để truy cập thông tin toàn diện bao gồm liều dùng, tác dụng phụ và hướng dẫn lâm sàng.",
  "landing.howItWorks.step2.title": "Kiểm tra tương tác thuốc",
  "landing.howItWorks.step2.description": "Thêm nhiều thuốc để xác định tương tác tiềm ẩn với mức độ nghiêm trọng và khuyến cáo xử trí.",
  "landing.howItWorks.step3.title": "Quản lý hồ sơ sức khỏe",
  "landing.howItWorks.step3.description": "Tạo đơn thuốc điện tử, lưu danh sách thuốc và theo dõi thông tin sức khỏe của bạn an toàn.",

  // Landing Page - CTA Section
  "landing.cta.badge": "Bắt đầu ngay",
  "landing.cta.title": "Sẵn sàng đưa ra Quyết định Thuốc Tốt hơn?",
  "landing.cta.description": "Tham gia cùng hàng nghìn chuyên gia y tế và bệnh nhân tin tưởng nền tảng của chúng tôi về an toàn thuốc và thông tin sức khỏe.",
  "landing.cta.primaryButton": "Tạo tài khoản miễn phí",
  "landing.cta.secondaryButton": "Khám phá thuốc",

  // Account Pages
  "account.settings": "Cài đặt tài khoản",
  "account.nav.overview": "Tổng quan",
  "account.nav.overview.description": "Xem thông tin tài khoản của bạn",
  "account.nav.editProfile": "Chỉnh sửa hồ sơ",
  "account.nav.editProfile.description": "Cập nhật thông tin cá nhân",
  "account.nav.security": "Bảo mật",
  "account.nav.security.description": "Đổi mật khẩu và cài đặt bảo mật",
  "account.nav.avatar": "Ảnh đại diện",
  "account.nav.avatar.description": "Cập nhật ảnh đại diện",

  // Account Overview
  "account.overview.title": "Tổng quan tài khoản",
  "account.overview.description": "Xem thông tin tài khoản và quản lý cài đặt",
  "account.overview.quickActions": "Thao tác nhanh",
  "account.overview.accountDetails": "Chi tiết tài khoản",
  "account.overview.editProfile": "Chỉnh sửa hồ sơ",
  "account.overview.editProfile.description": "Cập nhật tên và tên người dùng",
  "account.overview.changePassword": "Đổi mật khẩu",
  "account.overview.changePassword.description": "Cập nhật thông tin bảo mật",
  "account.overview.updateAvatar": "Cập nhật ảnh đại diện",
  "account.overview.updateAvatar.description": "Thay đổi ảnh đại diện",
  "account.overview.username": "Tên người dùng",
  "account.overview.email": "Email",
  "account.overview.firstName": "Tên",
  "account.overview.lastName": "Họ",
  "account.overview.role": "Vai trò",
  "account.overview.accountId": "Mã tài khoản",

  // Edit Profile
  "account.editProfile.title": "Chỉnh sửa hồ sơ",
  "account.editProfile.description": "Cập nhật thông tin cá nhân",
  "account.editProfile.backToAccount": "Quay lại tài khoản",
  "account.editProfile.username": "Tên người dùng",
  "account.editProfile.username.placeholder": "nguyenvan",
  "account.editProfile.username.description": "Tên người dùng duy nhất. Phải có 5-20 ký tự.",
  "account.editProfile.firstName": "Tên",
  "account.editProfile.firstName.placeholder": "Văn",
  "account.editProfile.firstName.description": "Chỉ chữ cái, không có dấu cách hoặc số.",
  "account.editProfile.lastName": "Họ",
  "account.editProfile.lastName.placeholder": "Nguyễn",
  "account.editProfile.lastName.description": "Họ của bạn.",
  "account.editProfile.email": "Email",
  "account.editProfile.email.readOnly": "Không thể thay đổi email.",
  "account.editProfile.saveChanges": "Lưu thay đổi",
  "account.editProfile.saving": "Đang lưu...",
  "account.editProfile.cancel": "Hủy",
  "account.editProfile.success": "Cập nhật hồ sơ thành công! Đang chuyển hướng...",
  "account.editProfile.error": "Không thể cập nhật hồ sơ.",

  // Security
  "account.security.title": "Cài đặt bảo mật",
  "account.security.description": "Quản lý mật khẩu và tùy chọn bảo mật",
  "account.security.changePassword": "Đổi mật khẩu",
  "account.security.changePassword.description": "Cập nhật mật khẩu để bảo mật tài khoản",
  "account.security.currentPassword": "Mật khẩu hiện tại",
  "account.security.currentPassword.placeholder": "Nhập mật khẩu hiện tại",
  "account.security.newPassword": "Mật khẩu mới",
  "account.security.newPassword.placeholder": "Nhập mật khẩu mới",
  "account.security.newPassword.description": "Mật khẩu phải có 6-20 ký tự.",
  "account.security.confirmPassword": "Xác nhận mật khẩu mới",
  "account.security.confirmPassword.placeholder": "Nhập lại mật khẩu mới",
  "account.security.updatePassword": "Cập nhật mật khẩu",
  "account.security.updating": "Đang cập nhật...",
  "account.security.reset": "Đặt lại",
  "account.security.success": "Đổi mật khẩu thành công!",
  "account.security.error": "Không thể đổi mật khẩu.",

  // Avatar
  "account.avatar.title": "Ảnh đại diện",
  "account.avatar.description": "Tải lên ảnh đại diện mới để cá nhân hóa hồ sơ",
  "account.avatar.currentAvatar": "Ảnh đại diện hiện tại",
  "account.avatar.uploadNew": "Tải lên ảnh mới",
  "account.avatar.supportedFormats": "Định dạng hỗ trợ: JPG, PNG, GIF (tối đa 5MB)",
  "account.avatar.preview": "Xem trước",
  "account.avatar.previewDescription": "Đây là cách ảnh đại diện mới của bạn sẽ hiển thị",
  "account.avatar.uploadAvatar": "Tải lên ảnh đại diện",
  "account.avatar.uploading": "Đang tải lên...",
  "account.avatar.cancel": "Hủy",
  "account.avatar.dragDrop": "Nhấp hoặc kéo thả để tải lên",
  "account.avatar.dropHere": "Thả ảnh của bạn vào đây",
  "account.avatar.fileSizeLimit": "JPG, PNG hoặc GIF tối đa 5MB",
  "account.avatar.success": "Cập nhật ảnh đại diện thành công!",
  "account.avatar.error": "Không thể tải lên ảnh đại diện.",
  "account.avatar.invalidType": "Vui lòng chọn tệp hình ảnh",
  "account.avatar.fileTooLarge": "Kích thước tệp phải nhỏ hơn 5MB",
};

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: enTranslations,
  vi: viTranslations,
};

type TranslationContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey | string, options?: TranslationOptions) => string;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

function format(template: string, values?: TranslationValues) {
  if (!values) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    const value = values[key];
    return value === undefined || value === null ? match : String(value);
  });
}

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("vi");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(
      "app-language"
    ) as Language | null;
    if (stored === "en" || stored === "vi") {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("app-language", language);
  }, [language]);

  const t = useCallback<TranslationContextValue["t"]>(
    (key, options) => {
      const { fallback, values } = options ?? {};
      const translation =
        translations[language]?.[key as TranslationKey] ??
        translations.en[key as TranslationKey] ??
        fallback ??
        String(key);
      return format(translation, values);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, t]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return ctx;
}
