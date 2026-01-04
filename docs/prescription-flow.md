# Prescription Module Documentation

## Overview

This module handles prescription creation by MED/ADMIN users and prescription viewing by USER role patients.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER ROLES                                  │
├─────────────────────────────────────────────────────────────────┤
│  MED/ADMIN → Can CREATE prescriptions                          │
│  USER      → Can VIEW their prescriptions                      │
└─────────────────────────────────────────────────────────────────┘
```

## MED User: Create Prescription

### Step 1: Fill Patient Info
- Prescription name
- Patient ID (userId)
- Start date
- Diagnosis note
- Message (instructions)

### Step 2: Add Drugs
1. Search drug by name → `GET /api/v1/drug/top10?name={query}`
2. Fill dosage info: quantity, unit, form, usage
3. Select timing: Sáng, Trưa, Chiều, Tối
4. Add notes: Trước ăn, Sau ăn, etc.
5. Click "Thêm thuốc" → adds to preview list

### Step 3: Drug Interaction Check
If more than 1 drug:
```
GET /api/v1/prescriptions/review?listDrugIds=1,2,3
```
Returns warnings if interactions exist.

### Step 4: Create Prescription
```
POST /api/v1/prescriptions
Authorization: Bearer {token}

Body: {
  name, description, userId, startDate,
  message, diagnosisNote, info,
  intakes: [{
    drugName, drugId, total, unit, quantitative,
    medicineForm, usage, timingList, noteList
  }]
}
```
Requires: `@PreAuthorize("hasAnyAuthority('MED', 'ADMIN')")`

### Step 5: QR Code
After success, displays QR code with URL: `/prescription/{id}`

---

## USER: View Prescriptions

### List View
```
GET /api/v1/prescriptions/search/name?userId={id}&name=&page=0&size=20
```

### Detail View
```
GET /api/v1/prescriptions/{id}
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/prescriptions` | Create prescription |
| GET | `/api/v1/prescriptions/{id}` | Get by ID |
| GET | `/api/v1/prescriptions/search/name` | Search by name |
| GET | `/api/v1/prescriptions/search/date` | Search by date range |
| GET | `/api/v1/prescriptions/review` | Check drug interactions |
| PUT | `/api/v1/prescriptions/edit/{id}` | Update intake status |
| POST | `/api/v1/prescriptions/{id}/copy` | Copy prescription |

---

## Key Frontend Files

| File | Purpose |
|------|---------|
| `features/prescriptions/types/index.ts` | TypeScript types & Zod schemas |
| `features/prescriptions/data-access/prescriptions.api.ts` | API functions |
| `features/prescriptions/queries/prescriptions.queries.ts` | React Query hooks |
| `components/pages/prescription-page.tsx` | Main prescription page |
| `app/(site)/prescription/[id]/page.tsx` | Detail page |
| `components/prescription/prescription-qr-code.tsx` | QR code component |
| `components/prescription/drug-search-select.tsx` | Drug search autocomplete |

---

## Key Backend Files

| File | Purpose |
|------|---------|
| `PrescriptionController.java` | REST endpoints |
| `PrescriptionServiceImpl.java` | Business logic |
| `PrescriptionRepository.java` | Database queries |
| `CreatePrescriptionRequest.java` | Request DTO |
| `IntakeRequest.java` | Drug intake DTO |
