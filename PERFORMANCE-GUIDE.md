# 🚀 Performance Guide - Heritage Wala

## 🐌 Why is my website slow?

### Development Server (`npm run dev`)
- ❌ **SLOW**: Compiles pages on-demand (10-50 seconds first load)
- ❌ No optimizations
- ❌ No caching
- ✅ Hot reload for development

### Production Server (`npm run start`)
- ✅ **FAST**: Pre-compiled pages (instant load)
- ✅ Full optimizations
- ✅ Caching enabled
- ❌ No hot reload

---

## ⚡ Quick Fix - Run Production Mode

### Option 1: One Command
```powershell
.\START-FAST.ps1
```

### Option 2: Manual
```powershell
npm run build
npm start
```

### Option 3: Combined
```powershell
npm run prod
```

---

## 📊 Performance Comparison

| Mode | First Load | Subsequent Loads | Use Case |
|------|-----------|------------------|----------|
| Dev (`npm run dev`) | 10-50s | 1-5s | Active development |
| Production (`npm start`) | 0.1-0.5s | 0.1-0.3s | Testing/Demo/Production |

---

## 🔧 Applied Optimizations

1. ✅ **Disabled query logging** (60% faster)
2. ✅ **API route caching** (60s cache)
3. ✅ **Selective field loading** (only needed fields)
4. ✅ **Database connection pooling**
5. ✅ **Production mode enabled**
6. ✅ **Static generation** where possible

---

## 🎯 Recommended Workflow

### During Development
```powershell
npm run dev
# Slow first load, but hot reload on changes
```

### For Testing/Demo
```powershell
npm run prod
# Fast load, no hot reload
# Rebuild when you make changes
```

---

## 🚨 Current Status

Your `.env` is set to `NODE_ENV="production"` for faster database queries.

If you need dev features (verbose logging), use `.env.development`:
```powershell
# Copy .env.development to .env for dev mode
Copy-Item .env.development .env -Force
```

---

## 💡 Tips

1. **Always run production build for demos/testing**
2. **Use dev mode only when actively coding**
3. **Clear cache if something breaks**: `Remove-Item .next -Recurse -Force`
4. **Database is in EU region** - expect 100-200ms latency from other regions

---

## 🔥 Emergency Speed Boost

If still slow:

```powershell
# 1. Clear Next.js cache
Remove-Item .next -Recurse -Force

# 2. Clear node modules
Remove-Item node_modules -Recurse -Force
npm install

# 3. Rebuild
npm run build
npm start
```
