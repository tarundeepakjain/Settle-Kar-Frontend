# SettleKar Tab Navigation

This implementation provides a bottom tab navigator for the SettleKar app with 4 main sections: Home, Groups, Transactions, and Profile.

## Features

- ✅ 4 bottom tabs with Ionicons
- ✅ Active tab color: Blue (#2563eb)
- ✅ Inactive tab color: Gray
- ✅ Hidden headers for all tabs
- ✅ Modular screen components for easy replacement
- ✅ Logout functionality in Profile tab

## Tab Structure

1. **Home** 🏠 - Main dashboard view
2. **Groups** 👥 - Group management
3. **Transactions** 💸 - Transaction history
4. **Profile** 🙍 - User profile and settings

## Dependencies

All required packages are already installed in your project:

```json
{
  "@react-navigation/bottom-tabs": "^7.3.10",
  "@react-navigation/native": "^7.1.6",
  "@expo/vector-icons": "^14.1.0"
}
```

## File Structure

```
app/
├── components/
│   └── TabNavigator.tsx          # Main tab navigator component
├── screens/
│   ├── HomeScreen.tsx            # Home tab screen
│   ├── GroupsScreen.tsx          # Groups tab screen
│   ├── TransactionsScreen.tsx    # Transactions tab screen
│   └── ProfileScreen.tsx         # Profile tab screen
└── dashboard.tsx                 # Updated dashboard with tab navigation
```

## Usage

The tab navigator is automatically loaded when users navigate to the dashboard after login/signup. Each screen component is modular and can be easily replaced with real features.

## Customization

### Changing Tab Colors
Edit the `tabBarActiveTintColor` and `tabBarInactiveTintColor` in `TabNavigator.tsx`:

```typescript
tabBarActiveTintColor: '#2563eb',    // Active tab color
tabBarInactiveTintColor: 'gray',     // Inactive tab color
```

### Adding New Tabs
1. Create a new screen component in `app/screens/`
2. Import it in `TabNavigator.tsx`
3. Add a new `Tab.Screen` component with appropriate icon

### Replacing Placeholder Screens
Each screen component in `app/screens/` is designed to be easily replaceable. Simply update the component content while keeping the same export structure.

## Icons Used

- **Home**: `home` / `home-outline`
- **Groups**: `people` / `people-outline`
- **Transactions**: `swap-horizontal` / `swap-horizontal-outline`
- **Profile**: `person` / `person-outline`

All icons are from `@expo/vector-icons` Ionicons set.
