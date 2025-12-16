# 🚀 Setup Instructions - Takless GitHub Repository

## מה יש כאן?

פרויקט Takless כולל:
- ✅ **pitch-deck.html** - מצגת אינטראקטיבית מקצועית (10 שקופיות) למשקיעים
- ✅ **README.md** - תיעוד מפורט של הפרויקט
- ✅ **one-pager.md** - מסמך עמוד אחד לשליחה מהירה למשקיעים
- ✅ Git repository מאותחל עם commit ראשון

---

## 📤 איך להעלות את הפרויקט לגיטהאב?

### אפשרות 1: יצירת Repository חדש בממשק GitHub (מומלץ)

1. **עבור לגיטהאב:**
   - לך ל-https://github.com/new
   - שם ל-repository: `takless`
   - תיאור: "Takless - Operational Bridge for Foreign Workforces in Israel"
   - בחר **Public** (או Private אם אתה רוצה)
   - **אל תסמן** "Initialize with README" (יש לנו כבר!)

2. **חבר את ה-Repository המקומי:**
   ```bash
   cd /home/user/takless
   git remote add origin https://github.com/YOUR_USERNAME/takless.git
   git push -u origin main
   ```

   **או אם אתה משתמש ב-SSH:**
   ```bash
   cd /home/user/takless
   git remote add origin git@github.com:YOUR_USERNAME/takless.git
   git push -u origin main
   ```

3. **זהו!** הפרויקט שלך עכשיו ב-GitHub 🎉

---

### אפשרות 2: שימוש ב-GitHub CLI (אם מותקן)

```bash
cd /home/user/takless
gh repo create takless --public --source=. --description "Takless - Operational Bridge for Foreign Workforces" --push
```

---

### אפשרות 3: העלאה לארגון/Organization

אם אתה רוצה להעלות תחת ארגון (לא חשבון אישי):

```bash
cd /home/user/takless
git remote add origin https://github.com/YOUR_ORG/takless.git
git push -u origin main
```

---

## 🌐 איך לפתוח את המצגת?

### באופן מקומי:
```bash
cd /home/user/takless
# פתח את pitch-deck.html בדפדפן
firefox pitch-deck.html
# או
google-chrome pitch-deck.html
# או
open pitch-deck.html  # macOS
```

### לאחר העלאה ל-GitHub:

1. **GitHub Pages (מצגת אונליין):**
   - Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/` (root)
   - שמור

   המצגת תהיה זמינה ב:
   `https://YOUR_USERNAME.github.io/takless/pitch-deck.html`

2. **שליחה למשקיעים:**
   - שלח את ה-URL של ה-GitHub Pages
   - או הורד את `pitch-deck.html` ושלח כקובץ
   - גם ה-`one-pager.md` ניתן להמיר ל-PDF ולשלוח

---

## 🎯 המשך עבודה

### הוספת קבצים נוספים:

```bash
cd /home/user/takless

# צור קבצים חדשים
# לדוגמה: business-plan.md, market-research.pdf, etc.

# הוסף לגיט
git add .
git commit -m "Add business plan and market research"
git push
```

### עדכון המצגת:

```bash
cd /home/user/takless

# ערוך את pitch-deck.html
nano pitch-deck.html
# או
vim pitch-deck.html

# שמור ודחוף
git add pitch-deck.html
git commit -m "Update pitch deck with new financial projections"
git push
```

---

## 📊 המלצות נוספות

1. **הוסף .gitignore:**
   ```bash
   echo "*.DS_Store" > .gitignore
   echo "node_modules/" >> .gitignore
   git add .gitignore
   git commit -m "Add .gitignore"
   git push
   ```

2. **הוסף LICENSE:**
   - אם אתה רוצה שהפרויקט יהיה פתוח: MIT License
   - אם אתה רוצה לשמור זכויות: All Rights Reserved

3. **הוסף תמונות/לוגו:**
   ```bash
   mkdir assets
   # העתק תמונות ל-assets/
   git add assets/
   git commit -m "Add brand assets"
   git push
   ```

---

## 🤝 שיתוף עם שותפים

אם יש לך שותפים שרוצים לעבוד על הפרויקט:

1. הוסף אותם כ-Collaborators ב-GitHub:
   - Settings → Collaborators → Add people

2. הם יכולים לשכפל את הפרויקט:
   ```bash
   git clone https://github.com/YOUR_USERNAME/takless.git
   cd takless
   ```

---

## 📞 צריך עזרה?

- [GitHub Docs](https://docs.github.com)
- [Git Tutorial](https://git-scm.com/docs/gittutorial)

---

**בהצלחה עם Takless! 🚀**
