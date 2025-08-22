# SettleKar Navigation Structure

This implementation provides a complete navigation structure for the SettleKar app using React Navigation with proper auth flow and bottom tabs.

## 🏗️ Navigation Architecture

```
AppNavigator (NavigationContainer)
├── Stack Navigator (Auth Flow)
│   ├── Login Screen
│   ├── Signup Screen
│   └── MainTabs (Bottom Tab Navigator)
│       ├── Home Screen 🏠
│       ├── Groups Screen 👥
│       ├── Transactions Screen 💸
│       └── Profile Screen 🙍
```

## ✅ Features Implemented

- ✅ **Single NavigationContainer** at the root level
- ✅ **Stack Navigator** for auth flow (Login → Signup → MainTabs)
- ✅ **Bottom Tab Navigator** for main app with 4 tabs
- ✅ **Proper Navigation Flow**: Login/Signup → MainTabs (Home tab by default)
- ✅ **Ionicons Integration** with focused/unfocused states
- ✅ **Custom Colors**: Blue (#2563eb) for active, gray for inactive
- ✅ **Hidden Headers** on all screens
- ✅ **Modular Screen Components** for easy replacement
- ✅ **Logout Functionality** in Profile tab

## 📁 File Structure

```
app/
├── navigation/
│   └── AppNavigator.tsx          # Main navigation container
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx       # Login screen
│   │   └── SignupScreen.tsx      # Signup screen
│   └── main/
│       ├── HomeScreen.tsx        # Home tab screen
│       ├── GroupsScreen.tsx      # Groups tab screen
│       ├── TransactionsScreen.tsx # Transactions tab screen
│       └── ProfileScreen.tsx     # Profile tab screen
├── _layout.tsx                   # Root layout using AppNavigator
└── index.tsx                     # App entry point
```

## 🔄 Navigation Flow

1. **App Launch** → Login Screen (initial route)
2. **Login Success** → `navigation.replace('MainTabs')` → Home tab
3. **Signup Success** → `navigation.replace('MainTabs')` → Home tab
4. **Logout** → `navigation.reset()` → Login Screen

## 🎨 Tab Configuration

### Icons Used
- **Home**: `home` / `home-outline`
- **Groups**: `people` / `people-outline`
- **Transactions**: `swap-horizontal` / `swap-horizontal-outline`
- **Profile**: `person` / `person-outline`

### Styling
- **Active Color**: #2563eb (blue)
- **Inactive Color**: gray
- **Tab Bar Height**: 60px
- **Background**: white with gray border

## 📦 Dependencies

All required packages are installed:

```json
{
  "@react-navigation/native": "^7.1.6",
  "@react-navigation/stack": "^7.0.0",
  "@react-navigation/bottom-tabs": "^7.3.10",
  "@expo/vector-icons": "^14.1.0"
}
```

## 🚀 Usage

The navigation is automatically set up when the app launches. Users will see:

1. **Login Screen** on app launch
2. **Signup Option** available from login screen
3. **Main App with Bottom Tabs** after successful auth
4. **Home Tab** as the default landing page

## 🔧 Customization

### Adding New Auth Screens
1. Create screen in `app/screens/auth/`
2. Add to Stack Navigator in `AppNavigator.tsx`
3. Use `navigation.navigate('ScreenName')` to navigate

### Adding New Main App Screens
1. Create screen in `app/screens/main/`
2. Add to Tab Navigator in `AppNavigator.tsx`
3. Choose appropriate Ionicons

### Changing Tab Colors
Edit in `AppNavigator.tsx`:
```typescript
tabBarActiveTintColor: '#2563eb',    // Active tab color
tabBarInactiveTintColor: 'gray',     // Inactive tab color
```

### Replacing Placeholder Screens
Each screen component is modular and can be easily replaced with real features while maintaining the same export structure.

## 🔐 Auth Flow Details

- **Login**: Email + Password → MainTabs
- **Signup**: Name + Email + Password + Confirm Password → MainTabs
- **Logout**: Profile tab → Login Screen (with navigation reset)

## 🎯 Key Benefits

1. **Clean Architecture**: Proper separation of auth and main app flows
2. **Single NavigationContainer**: Prevents navigation conflicts
3. **Modular Design**: Easy to replace placeholder screens
4. **Type Safety**: Full TypeScript support
5. **Performance**: Optimized navigation structure
6. **User Experience**: Smooth transitions and proper state management
