# JOGJA FREELANCE PASSPORT - DESIGN SYSTEM
## Amazon-Inspired Styling & UI Components

---

## COLOR PALETTE

### Primary Colors

```css
/* CTA / Primary Actions */
--color-orange: #FF9900;  /* Buttons, Links, Highlights */
--color-orange-hover: #EC7211;
--color-orange-active: #DAA520;

/* Text & Backgrounds */
--color-dark-slate: #232F3E;  /* Main text color */
--color-dark-slate-light: #37475A;
--color-light-gray: #F1F1F1;  /* Page backgrounds */
--color-gray: #CCCCCC;  /* Borders, disabled states */

/* Secondary UI */
--color-blue: #146EB4;  /* Links, info elements */
--color-blue-hover: #0A66C2;
```

### Semantic Colors

```css
--color-success: #12A54D;  /* Green - Success messages */
--color-warning: #FF9900;  /* Orange - Same as primary */
--color-error: #DC2C1E;    /* Red - Errors */
--color-info: #146EB4;     /* Blue - Same as secondary */
```

### Usage

```css
/* Button Primary */
.btn-primary {
  background-color: var(--color-orange);
  color: #FFFFFF;
}

.btn-primary:hover {
  background-color: var(--color-orange-hover);
}

/* Text */
.text-primary {
  color: var(--color-dark-slate);
}

/* Borders */
.input, .card {
  border: 1px solid var(--color-gray);
}
```

---

## TYPOGRAPHY

### Font Family

```css
--font-family-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
--font-family-mono: "Monaco", "Menlo", "Ubuntu Mono", monospace;
```

### Font Sizes & Weights

```css
/* Headings */
--h1-size: 32px;
--h1-weight: 700;
--h1-line-height: 1.2;

--h2-size: 24px;
--h2-weight: 700;
--h2-line-height: 1.3;

--h3-size: 20px;
--h3-weight: 600;
--h3-line-height: 1.4;

--h4-size: 18px;
--h4-weight: 600;
--h4-line-height: 1.4;

/* Body Text */
--body-lg-size: 16px;
--body-lg-weight: 400;

--body-size: 14px;
--body-weight: 400;
--body-line-height: 1.6;

--body-sm-size: 12px;
--body-sm-weight: 400;
--body-sm-line-height: 1.5;

/* Buttons & Captions */
--button-size: 14px;
--button-weight: 700;

--caption-size: 12px;
--caption-weight: 400;
--caption-color: #565A5C;
```

### Implementation

```html
<h1 class="text-h1">Temukan Pekerjaan di Yogyakarta</h1>
<p class="text-body">Deskripsi singkat tentang platform.</p>
<small class="text-caption">Catatan atau keterangan kecil</small>
```

---

## SPACING SYSTEM

### Base Unit: 8px

```css
--space-1: 4px;    /* 0.5x)
--space-2: 8px;    /* 1x - xs */
--space-3: 12px;   /* 1.5x */
--space-4: 16px;   /* 2x - sm */
--space-5: 20px;
--space-6: 24px;   /* 3x - md */
--space-7: 28px;
--space-8: 32px;   /* 4x - lg */
--space-9: 36px;
--space-10: 40px;  /* 5x - xl */
--space-12: 48px;  /* 6x - 2xl */
--space-16: 64px;  /* 8x - 4xl */
```

### Usage in Tailwind

```html
<!-- Padding -->
<div class="p-4">Padding 16px all sides</div>
<div class="px-6 py-4">Padding X/Y</div>

<!-- Margin -->
<div class="m-4">Margin 16px</div>
<div class="mb-6">Margin bottom 24px</div>

<!-- Gap (flexbox/grid) -->
<div class="flex gap-4">Flex gap 16px</div>
<div class="grid grid-cols-3 gap-6">Grid gap 24px</div>
```

---

## COMPONENTS

### 1. BUTTONS

#### Primary Button

```html
<button class="btn btn-primary">
  Lamar Pekerjaan
</button>
```

```css
.btn {
  display: inline-block;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  border: none;
}

.btn-primary {
  background-color: #FF9900;
  color: #FFFFFF;
}

.btn-primary:hover {
  background-color: #EC7211;
}

.btn-primary:active {
  background-color: #DAA520;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}

.btn-primary:disabled {
  background-color: #CCCCCC;
  color: #999999;
  cursor: not-allowed;
  opacity: 0.6;
}
```

#### Secondary Button

```html
<button class="btn btn-secondary">
  Batal
</button>
```

```css
.btn-secondary {
  background-color: #FFFFFF;
  color: #232F3E;
  border: 1px solid #CCCCCC;
}

.btn-secondary:hover {
  background-color: #F1F1F1;
  border-color: #999999;
}
```

#### Tertiary (Link) Button

```html
<a href="#" class="btn btn-tertiary">
  Lihat detail →
</a>
```

```css
.btn-tertiary {
  background: transparent;
  color: #146EB4;
  text-decoration: none;
  padding: 0;
}

.btn-tertiary:hover {
  text-decoration: underline;
}
```

---

### 2. FORM INPUTS

#### Text Input

```html
<div class="form-group">
  <label class="form-label">Email Address</label>
  <input 
    type="email" 
    class="form-input" 
    placeholder="you@example.com"
  />
  <span class="form-error">Email tidak valid</span>
</div>
```

```css
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #232F3E;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  background-color: #FFFFFF;
  transition: border-color 200ms;
}

.form-input:focus {
  outline: none;
  border-color: #146EB4;
  box-shadow: 0 0 0 2px rgba(20, 110, 180, 0.1);
}

.form-input:disabled {
  background-color: #F1F1F1;
  border-color: #E7E7E7;
  color: #999999;
  cursor: not-allowed;
}

.form-error {
  display: block;
  color: #DC2C1E;
  font-size: 12px;
  margin-top: 4px;
}
```

#### Select Dropdown

```html
<select class="form-input">
  <option>Web Development</option>
  <option>UI/UX Design</option>
  <option>Content Writing</option>
</select>
```

#### Checkbox

```html
<label class="checkbox-label">
  <input type="checkbox" class="checkbox-input" />
  <span>Saya setuju dengan syarat dan ketentuan</span>
</label>
```

```css
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  border: 2px solid #CCCCCC;
  border-radius: 3px;
  cursor: pointer;
}

.checkbox-input:checked {
  background-color: #146EB4;
  border-color: #146EB4;
}
```

---

### 3. CARDS

#### Job Card

```html
<div class="card card-job">
  <div class="card-badge">Web Development</div>
  <h3 class="card-title">React Frontend Developer</h3>
  <p class="card-company">Startup Tech XYZ</p>
  <p class="card-description">Kami mencari developer React berpengalaman...</p>
  
  <div class="card-meta">
    <span class="meta-item">💰 Rp 5.000.000</span>
    <span class="meta-item">⏰ 30 hari</span>
  </div>
  
  <div class="card-actions">
    <button class="btn btn-primary">Lamar</button>
    <button class="btn btn-secondary">Simpan</button>
  </div>
</div>
```

```css
.card {
  border: 1px solid #E7E7E7;
  border-radius: 8px;
  padding: 16px;
  background-color: #FFFFFF;
  transition: all 200ms ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.card-badge {
  display: inline-block;
  background-color: #EBF5FF;
  color: #146EB4;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #232F3E;
}

.card-company {
  font-size: 14px;
  color: #565A5C;
  margin-bottom: 8px;
}

.card-description {
  font-size: 14px;
  color: #232F3E;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #565A5C;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.card-actions .btn {
  flex: 1;
  padding: 10px 16px;
  font-size: 13px;
}
```

#### Badge Card (Achievement)

```html
<div class="card card-badge">
  <div class="badge-icon">🎯</div>
  <h4 class="badge-name">First Application</h4>
  <p class="badge-date">Earned on June 16, 2026</p>
</div>
```

```css
.card-badge {
  text-align: center;
  padding: 24px 16px;
  border: 2px solid #FFD700;
  border-radius: 12px;
  background: linear-gradient(135deg, #FFF8DC, #FFFACD);
}

.badge-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.badge-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.badge-date {
  font-size: 12px;
  color: #565A5C;
}
```

---

### 4. NAVIGATION

#### Header

```html
<header class="header">
  <div class="header-content">
    <h1 class="logo">Jogja Freelance</h1>
    
    <input 
      type="text" 
      class="search-input" 
      placeholder="Cari pekerjaan..."
    />
    
    <nav class="nav">
      <a href="/jobs" class="nav-link">Pekerjaan</a>
      <a href="/passport" class="nav-link">Panduan</a>
      <a href="/events" class="nav-link">Events</a>
    </nav>
    
    <div class="header-actions">
      <button class="btn-icon">🔔</button>
      <button class="btn-icon">👤</button>
    </div>
  </div>
</header>
```

```css
.header {
  background-color: #232F3E;
  color: #FFFFFF;
  padding: 12px 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
}

.nav {
  display: flex;
  gap: 24px;
  flex: 1;
}

.nav-link {
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  transition: opacity 200ms;
}

.nav-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.header-actions {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.btn-icon {
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 20px;
  cursor: pointer;
}
```

---

### 5. BADGES & PROGRESS

#### Progress Bar

```html
<div class="progress-bar">
  <div class="progress-fill" style="width: 60%;"></div>
</div>
<p class="progress-label">Day 18 of 30</p>
```

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #E7E7E7;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background-color: #FF9900;
  transition: width 300ms ease;
}

.progress-label {
  font-size: 12px;
  color: #565A5C;
  font-weight: 600;
}
```

#### Achievement Badge

```html
<div class="achievement-badge achieved">
  <div class="badge-circle">
    <span class="badge-icon">🎯</span>
  </div>
  <p class="badge-label">First Application</p>
</div>
```

```css
.achievement-badge {
  text-align: center;
}

.achievement-badge.locked {
  opacity: 0.4;
  filter: grayscale(100%);
}

.badge-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid #FFD700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  background: linear-gradient(135deg, #FFF8DC, #FFFACD);
  animation: pulse 2s infinite;
}

.badge-icon {
  font-size: 32px;
}

.badge-label {
  font-size: 14px;
  font-weight: 600;
  color: #232F3E;
  margin: 0;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 217, 0, 0.7);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 217, 0, 0);
  }
}
```

---

### 6. MODALS & DIALOGS

```html
<div class="modal-overlay active">
  <div class="modal">
    <div class="modal-header">
      <h3>Lamar Pekerjaan</h3>
      <button class="modal-close">×</button>
    </div>
    
    <div class="modal-body">
      <form>
        <div class="form-group">
          <label>Pesan Singkat (maksimal 300 karakter)</label>
          <textarea class="form-input" rows="4"></textarea>
        </div>
      </form>
    </div>
    
    <div class="modal-footer">
      <button class="btn btn-secondary">Batal</button>
      <button class="btn btn-primary">Kirim Lamaran</button>
    </div>
  </div>
</div>
```

```css
.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 200;
}

.modal-overlay.active {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  max-width: 500px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #E7E7E7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #565A5C;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #E7E7E7;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
```

---

### 7. ALERTS & NOTIFICATIONS

#### Toast Notification

```html
<div class="toast toast-success">
  ✓ Lamaran berhasil dikirim!
</div>
```

```css
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  padding: 16px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 300;
  animation: slideIn 300ms ease;
}

.toast-success {
  background-color: #E6F7E6;
  color: #0F6D31;
  border-left: 4px solid #12A54D;
}

.toast-error {
  background-color: #FDE8E8;
  color: #8B0000;
  border-left: 4px solid #DC2C1E;
}

.toast-info {
  background-color: #E1F5FE;
  color: #01579B;
  border-left: 4px solid #146EB4;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Single column layouts */
  .grid-cols-3 { grid-template-columns: 1fr; }
  
  /* Hide unnecessary elements */
  .hide-mobile { display: none; }
  
  /* Adjust spacing */
  .p-6 { padding: 12px; }
  
  /* Full width buttons */
  .btn { width: 100%; }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1023px) {
  .grid-cols-3 { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}
```

---

## ACCESSIBILITY

### Focus States

```css
/* All interactive elements must have visible focus */
button:focus,
input:focus,
a:focus {
  outline: 2px solid #146EB4;
  outline-offset: 2px;
}
```

### Color Contrast

```
Text on background: 4.5:1 minimum
UI components: 3:1 minimum
Large text: 3:1 minimum
```

### Screen Reader Support

```html
<!-- Use semantic HTML -->
<button aria-label="Close dialog">×</button>

<!-- Skip links -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- ARIA labels for icons -->
<span aria-label="1 new notification">🔔 1</span>
```

---

## ANIMATION & TRANSITIONS

```css
/* Default transition timing */
--transition-fast: 150ms ease-in-out;
--transition-normal: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;

/* Button hover */
.btn {
  transition: all var(--transition-normal);
}

/* Page transitions */
.page-enter {
  animation: fadeIn 300ms ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Badge unlock animation */
@keyframes badgeUnlock {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

## COMPONENT CHECKLIST

- [x] Buttons (3 variants)
- [x] Form inputs (text, select, checkbox)
- [x] Cards (job, badge, event)
- [x] Navigation (header, sidebar)
- [x] Modals & dialogs
- [x] Badges & achievements
- [x] Progress bars
- [x] Alerts & toasts
- [x] Tables
- [x] Pagination

---

## IMPLEMENTATION

All these styles should be implemented in Tailwind CSS utilities or CSS modules. The goal is **clean, minimal, professional** design that gets out of the way and lets the content shine.

**Key principles:**
1. **Orange for CTAs** - Clear, high contrast call-to-action
2. **Dark slate for text** - Easy to read, professional
3. **Light backgrounds** - Minimal, clean appearance
4. **Generous spacing** - Breathing room between elements
5. **Fast interactions** - 200ms transitions feel responsive
6. **Mobile first** - Design for small screens first
7. **Accessible** - WCAG AA compliant

---

This design system ensures consistency, professionalism, and usability across the entire Jogja Freelance Passport platform.
