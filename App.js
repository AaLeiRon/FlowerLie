// ============================================================
// FLOWERLY — React Native (Expo) App
// ============================================================
// Drop this file into your Expo project as App.js
// Install deps first — see the guide.
// ============================================================

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Animated,
  Modal,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_400Regular_Italic } from "@expo-google-fonts/playfair-display";
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from "@expo-google-fonts/dm-sans";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── COLORS & THEME ────────────────────────────────────────
const C = {
  bg: "#FDF8F4",
  card: "#FFFFFF",
  text: "#2D2A26",
  textSoft: "#7A756F",
  textMuted: "#B5AFA8",
  accent: "#C06C84",
  accentLight: "#F8E8ED",
  accentDark: "#9B4D64",
  green: "#55A38C",
  greenLight: "#E8F5F0",
  peach: "#F5C6AA",
  peachLight: "#FFF3EC",
  lavender: "#A29BFE",
  lavenderLight: "#F0EEFF",
  border: "#EDE8E3",
  star: "#F6B93B",
  blue: "#4A90D9",
};

// ─── DATA ──────────────────────────────────────────────────
const EVENTS = [
  { id: "birthday", name: "Birthday", emoji: "🎂", color: "#FF6B8A" },
  { id: "valentines", name: "Valentine's", emoji: "💕", color: "#E84393" },
  { id: "mothers", name: "Mother's Day", emoji: "👩‍👧", color: "#FDA7DF" },
  { id: "engagement", name: "Engagement", emoji: "💍", color: "#A29BFE" },
  { id: "marriage", name: "Anniversary", emoji: "💒", color: "#FFEAA7" },
  { id: "easter", name: "Easter", emoji: "🐣", color: "#81ECEC" },
  { id: "christmas", name: "Christmas", emoji: "🎄", color: "#D63031" },
  { id: "fathers", name: "Father's Day", emoji: "👨‍👧", color: "#0984E3" },
];

const SHOPS = [
  { id: 1, name: "Rosa's Garden", address: "123 Bloom Street", rating: 4.8, reviews: 234, distance: "0.8 km", lat: 48.2085, lng: 16.3735, specialty: "Roses & Romance", price: "€€", emoji: "🌹", hours: "8:00–19:00", delivery: true },
  { id: 2, name: "Petals & Stems", address: "45 Flower Lane", rating: 4.6, reviews: 189, distance: "1.2 km", lat: 48.2120, lng: 16.3650, specialty: "Modern Arrangements", price: "€€€", emoji: "💐", hours: "9:00–20:00", delivery: true },
  { id: 3, name: "Green Thumb Florist", address: "78 Garden Ave", rating: 4.9, reviews: 312, distance: "2.1 km", lat: 48.2040, lng: 16.3820, specialty: "Sustainable & Local", price: "€", emoji: "🌿", hours: "7:30–18:00", delivery: false },
  { id: 4, name: "Wildflower Studio", address: "12 Meadow Rd", rating: 4.7, reviews: 156, distance: "1.5 km", lat: 48.2155, lng: 16.3700, specialty: "Wildflower Bouquets", price: "€€", emoji: "🌸", hours: "8:00–18:30", delivery: true },
  { id: 5, name: "Orchid House", address: "99 Exotic Blvd", rating: 4.5, reviews: 98, distance: "3.2 km", lat: 48.1990, lng: 16.3900, specialty: "Exotic Flowers", price: "€€€", emoji: "🌺", hours: "10:00–19:00", delivery: true },
  { id: 6, name: "The Flower Cart", address: "5 Market Square", rating: 4.4, reviews: 267, distance: "0.4 km", lat: 48.2100, lng: 16.3770, specialty: "Budget Bouquets", price: "€", emoji: "🌻", hours: "6:00–17:00", delivery: false },
];

const PLANS = [
  { id: "essential", name: "Essential Bloom", events: 4, price: 29.99, desc: "4 events per year", features: ["Choose 4 special dates", "Standard bouquets", "Free delivery", "48h advance reminder"], color: "#55A38C", popular: false },
  { id: "premium", name: "Premium Petal", events: 8, price: 49.99, desc: "8 events per year", features: ["Choose 8 special dates", "Premium arrangements", "Free express delivery", "Custom card messages", "Flower preference profile"], color: "#C06C84", popular: true },
  { id: "ultimate", name: "Year of Flowers", events: 12, price: 79.99, desc: "Monthly deliveries", features: ["12 monthly deliveries", "Luxury arrangements", "Same-day delivery", "Personal florist consultant", "Seasonal surprises", "Priority support"], color: "#6C5B7B", popular: false },
];

const USER_EVENTS = [
  { month: 1, name: "Mom's Birthday", date: "Jan 15", color: "#FF6B8A", status: "Scheduled" },
  { month: 2, name: "Valentine's Day", date: "Feb 14", color: "#E84393", status: "Scheduled" },
  { month: 3, name: "Anniversary", date: "Mar 22", color: "#FFEAA7", status: "Pending" },
  { month: 5, name: "Mother's Day", date: "May 11", color: "#FDA7DF", status: "Scheduled" },
  { month: 6, name: "Dad's Birthday", date: "Jun 8", color: "#FF6B8A", status: "Pending" },
  { month: 6, name: "Father's Day", date: "Jun 15", color: "#0984E3", status: "Pending" },
  { month: 9, name: "Friend's Birthday", date: "Sep 3", color: "#FF6B8A", status: "Pending" },
  { month: 12, name: "Christmas", date: "Dec 25", color: "#D63031", status: "Pending" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── HELPER COMPONENTS ─────────────────────────────────────

function StarRating({ rating, size = 12 }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
      <Ionicons name="star" size={size} color={C.star} />
      <Text style={{ fontSize: size + 1, fontFamily: "DMSans_600SemiBold", color: C.text }}>{rating}</Text>
    </View>
  );
}

function Tag({ label, bg, color, icon }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: bg, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 }}>
      {icon && <Text style={{ fontSize: 11 }}>{icon}</Text>}
      <Text style={{ fontSize: 11, fontFamily: "DMSans_500Medium", color }}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title, linkText, onLink }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingHorizontal: 20 }}>
      <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 20, color: C.text }}>{title}</Text>
      {linkText && (
        <TouchableOpacity onPress={onLink}>
          <Text style={{ fontSize: 13, fontFamily: "DMSans_600SemiBold", color: C.accent }}>{linkText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function CheckIcon({ color, size = 18 }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color + "20", alignItems: "center", justifyContent: "center" }}>
      <Ionicons name="checkmark" size={size - 6} color={color} />
    </View>
  );
}

// ─── SHOP CARD ─────────────────────────────────────────────

function ShopCard({ shop, index, onPress, isFav, onToggleFav }) {
  const bgColors = [C.accentLight, C.lavenderLight, C.greenLight];
  return (
    <TouchableOpacity style={s.shopCard} onPress={onPress} activeOpacity={0.7}>
      <View style={s.shopCardTop}>
        <View style={[s.shopAvatar, { backgroundColor: bgColors[index % 3] }]}>
          <Text style={{ fontSize: 28 }}>{shop.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={s.shopName}>{shop.name}</Text>
            <TouchableOpacity onPress={onToggleFav} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name={isFav ? "heart" : "heart-outline"} size={20} color={C.accent} />
            </TouchableOpacity>
          </View>
          <Text style={s.shopAddress}>{shop.address}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 }}>
            <StarRating rating={shop.rating} />
            <Text style={{ fontSize: 12, color: C.textMuted }}>({shop.reviews})</Text>
            <View style={{ backgroundColor: C.bg, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 20 }}>
              <Text style={{ fontSize: 11, color: C.textSoft, fontFamily: "DMSans_500Medium" }}>{shop.distance}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
        <Tag label={shop.specialty} bg={C.peachLight} color={C.accent} />
        <Tag label={shop.price} bg={C.bg} color={C.textSoft} />
        {shop.delivery && <Tag label="Delivery" bg={C.greenLight} color={C.green} icon="🚚" />}
      </View>
    </TouchableOpacity>
  );
}

// ─── SHOP DETAIL MODAL ─────────────────────────────────────

function ShopDetailModal({ shop, visible, onClose, isFav, onToggleFav, onSubscribe }) {
  if (!shop) return null;
  const bouquets = [
    { emoji: "🌹", name: "Classic Romance", price: "€35" },
    { emoji: "🌷", name: "Spring Garden", price: "€28" },
    { emoji: "🌻", name: "Sunshine Mix", price: "€25" },
    { emoji: "💐", name: "Seasonal Special", price: "€42" },
  ];
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.modalOverlay}>
        <View style={s.modalSheet}>
          <View style={s.modalHandle} />
          <View style={s.modalHeader}>
            <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 20, color: C.text, flex: 1 }}>{shop.name}</Text>
            <TouchableOpacity onPress={onClose} style={s.modalClose}>
              <Ionicons name="close" size={18} color={C.textSoft} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
            <View style={s.modalHero}>
              <Text style={{ fontSize: 56 }}>{shop.emoji}</Text>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 12 }}>
              <Tag label={`⭐ ${shop.rating} (${shop.reviews})`} bg={C.card} color={C.text} />
              <Tag label={`📍 ${shop.distance}`} bg={C.card} color={C.text} />
              <Tag label={`🕐 ${shop.hours}`} bg={C.card} color={C.text} />
              <Tag label={shop.price} bg={C.card} color={C.text} />
              {shop.delivery && <Tag label="🚚 Delivery" bg={C.card} color={C.text} />}
            </View>

            <Text style={{ fontSize: 13.5, color: C.textSoft, lineHeight: 20, marginVertical: 8 }}>
              {shop.name} is a beloved local florist specializing in {shop.specialty.toLowerCase()}.
              Located at {shop.address}, they craft beautiful arrangements for every occasion with
              locally sourced, seasonal flowers.
            </Text>

            <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 16, color: C.text, marginTop: 18, marginBottom: 10 }}>
              Popular Bouquets
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {bouquets.map((b, i) => (
                <TouchableOpacity key={i} style={s.bouquetCard} activeOpacity={0.7}>
                  <Text style={{ fontSize: 32, marginBottom: 6 }}>{b.emoji}</Text>
                  <Text style={{ fontSize: 13, fontFamily: "DMSans_600SemiBold", color: C.text, marginBottom: 2 }}>{b.name}</Text>
                  <Text style={{ fontSize: 12, fontFamily: "DMSans_600SemiBold", color: C.accent }}>{b.price}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 24, marginBottom: 40 }}>
              <TouchableOpacity style={[s.modalCta, { backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border }]} onPress={onToggleFav}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Ionicons name={isFav ? "heart" : "heart-outline"} size={16} color={C.accent} />
                  <Text style={{ fontSize: 14, fontFamily: "DMSans_600SemiBold", color: C.text }}>{isFav ? "Saved" : "Save"}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalCta, { backgroundColor: C.accent }]} onPress={onSubscribe}>
                <Text style={{ fontSize: 14, fontFamily: "DMSans_600SemiBold", color: "#FFF", textAlign: "center" }}>Select for Subscription</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── CONFIRMATION MODAL ────────────────────────────────────

function ConfirmationModal({ visible, onDone }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.confirmOverlay}>
        <View style={s.confirmCard}>
          <View style={s.confirmIcon}>
            <Ionicons name="checkmark" size={28} color={C.green} />
          </View>
          <Text style={s.confirmTitle}>Wonderful Choice! 🌸</Text>
          <Text style={s.confirmDesc}>
            Your flower subscription is being set up. You'll receive a confirmation email with all the details shortly.
          </Text>
          <TouchableOpacity style={s.confirmBtn} onPress={onDone} activeOpacity={0.8}>
            <Text style={{ fontSize: 15, fontFamily: "DMSans_600SemiBold", color: "#FFF" }}>View My Calendar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB SCREENS
// ═══════════════════════════════════════════════════════════

// ─── HOME ──────────────────────────────────────────────────

function HomeScreen({ setTab, selectedEvent, setSelectedEvent, favorites, toggleFav, setSelectedShop }) {
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={{ padding: 20, paddingTop: 12, paddingBottom: 24 }}>
        <Text style={{ fontSize: 14, color: C.textSoft, fontFamily: "DMSans_400Regular", marginBottom: 4 }}>
          Good morning, Sarah 👋
        </Text>
        <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 28, color: C.text, lineHeight: 34, marginBottom: 16 }}>
          Make every moment{" "}
          <Text style={{ fontFamily: "PlayfairDisplay_400Regular_Italic", color: C.accent }}>bloom</Text>
          {" "}beautifully
        </Text>
        <TouchableOpacity style={s.searchBar} onPress={() => setTab("map")} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={18} color={C.textMuted} />
          <Text style={{ flex: 1, fontSize: 15, color: C.textMuted, fontFamily: "DMSans_400Regular" }}>
            Find florists, bouquets, events...
          </Text>
        </TouchableOpacity>
      </View>

      {/* Event Chips */}
      <SectionHeader title="Special Events" linkText="View Calendar" onLink={() => setTab("calendar")} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: 8 }}>
        {EVENTS.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={[s.eventChip, selectedEvent === e.id && { borderColor: C.accent, backgroundColor: C.accentLight }]}
            onPress={() => setSelectedEvent(selectedEvent === e.id ? null : e.id)}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20 }}>{e.emoji}</Text>
            <Text style={{ fontSize: 13, fontFamily: "DMSans_600SemiBold", color: C.text }}>{e.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Feature Banners */}
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <TouchableOpacity style={[s.banner, { backgroundColor: C.accent }]} onPress={() => setTab("plans")} activeOpacity={0.8}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 18, color: "#FFF", marginBottom: 4 }}>
              Never Forget a Special Day
            </Text>
            <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "DMSans_400Regular" }}>
              Subscribe & auto-deliver flowers for every occasion
            </Text>
          </View>
          <Text style={{ fontSize: 42, opacity: 0.5 }}>🌷</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.banner, { backgroundColor: C.green }]} onPress={() => setTab("map")} activeOpacity={0.8}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 18, color: "#FFF", marginBottom: 4 }}>
              Discover Local Florists
            </Text>
            <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "DMSans_400Regular" }}>
              Find the best flower shops near you
            </Text>
          </View>
          <Text style={{ fontSize: 42, opacity: 0.5 }}>🗺️</Text>
        </TouchableOpacity>
      </View>

      {/* Nearby Shops */}
      <View style={{ marginTop: 8 }}>
        <SectionHeader title="Nearby Shops" linkText="See Map" onLink={() => setTab("map")} />
        <View style={{ paddingHorizontal: 20 }}>
          {SHOPS.slice(0, 3).map((shop, i) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              index={i}
              onPress={() => setSelectedShop(shop)}
              isFav={favorites.has(shop.id)}
              onToggleFav={() => toggleFav(shop.id)}
            />
          ))}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// ─── MAP / EXPLORE ─────────────────────────────────────────

function MapScreen({ favorites, toggleFav, setSelectedShop }) {
  const [activePin, setActivePin] = useState(null);
  const mapRef = useRef(null);
  const activeShop = SHOPS.find((s) => s.id === activePin);

  const initialRegion = {
    latitude: 48.2082,
    longitude: 16.3738,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Search */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        <View style={[s.searchBar, { flexDirection: "row" }]}>
          <Ionicons name="search-outline" size={18} color={C.textMuted} />
          <TextInput
            placeholder="Search florists, bouquets..."
            placeholderTextColor={C.textMuted}
            style={{ flex: 1, fontSize: 15, fontFamily: "DMSans_400Regular", color: C.text, marginLeft: 10 }}
          />
          <TouchableOpacity style={{ backgroundColor: C.accentLight, borderRadius: 8, padding: 6 }}>
            <Ionicons name="options-outline" size={18} color={C.accent} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <View style={{ marginHorizontal: 20, borderRadius: 16, overflow: "hidden", height: 300 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {SHOPS.map((shop) => (
            <Marker
              key={shop.id}
              coordinate={{ latitude: shop.lat, longitude: shop.lng }}
              title={shop.name}
              description={shop.specialty}
              onPress={() => setActivePin(shop.id === activePin ? null : shop.id)}
            >
              <View style={{ alignItems: "center" }}>
                <View style={[
                  s.mapPinIcon,
                  activePin === shop.id && { backgroundColor: C.accent, transform: [{ scale: 1.2 }] }
                ]}>
                  <Text style={{ fontSize: 18 }}>{shop.emoji}</Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>

        {/* Popup card */}
        {activeShop && (
          <TouchableOpacity
            style={s.mapPopup}
            onPress={() => setSelectedShop(activeShop)}
            activeOpacity={0.9}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: C.accentLight, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22 }}>{activeShop.emoji}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontFamily: "DMSans_600SemiBold", fontSize: 14, color: C.text }}>{activeShop.name}</Text>
              <Text style={{ fontSize: 12, color: C.textSoft, fontFamily: "DMSans_400Regular" }}>
                {activeShop.specialty} · {activeShop.distance}
              </Text>
            </View>
            <StarRating rating={activeShop.rating} size={11} />
            <Ionicons name="chevron-forward" size={18} color={C.textMuted} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        )}
      </View>

      {/* Full list */}
      <ScrollView style={{ flex: 1, marginTop: 16 }} showsVerticalScrollIndicator={false}>
        <SectionHeader title="All Florists" />
        <View style={{ paddingHorizontal: 20 }}>
          {SHOPS.map((shop, i) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              index={i}
              onPress={() => setSelectedShop(shop)}
              isFav={favorites.has(shop.id)}
              onToggleFav={() => toggleFav(shop.id)}
            />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ─── PLANS ─────────────────────────────────────────────────

function PlansScreen({ onSubscribe }) {
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Text style={{ fontSize: 32, marginBottom: 8 }}>💐</Text>
        <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 24, color: C.text, marginBottom: 4 }}>Subscription Plans</Text>
        <Text style={{ fontSize: 14, color: C.textSoft, fontFamily: "DMSans_400Regular" }}>Flowers for every special moment, all year long</Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {PLANS.map((plan) => (
          <View key={plan.id} style={[s.planCard, plan.popular && { borderColor: C.accent, borderWidth: 1.5 }]}>
            {plan.popular && (
              <View style={s.planBadge}>
                <Text style={{ fontSize: 10, fontFamily: "DMSans_700Bold", color: "#FFF", letterSpacing: 0.8 }}>MOST POPULAR</Text>
              </View>
            )}
            <Text style={[s.planName, { color: plan.color }]}>{plan.name}</Text>
            <Text style={s.planDesc}>{plan.desc}</Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", marginBottom: 16 }}>
              <Text style={[s.planPrice, { color: plan.color }]}>€{plan.price}</Text>
              <Text style={{ fontSize: 14, color: C.textSoft, fontFamily: "DMSans_500Medium" }}>/mo</Text>
            </View>
            {plan.features.map((f, j) => (
              <View key={j} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 5 }}>
                <CheckIcon color={plan.color} />
                <Text style={{ fontSize: 13.5, color: C.textSoft, fontFamily: "DMSans_400Regular" }}>{f}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={[s.planCta, plan.popular ? { backgroundColor: plan.color } : { backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border }]}
              onPress={onSubscribe}
              activeOpacity={0.8}
            >
              <Text style={[s.planCtaText, { color: plan.popular ? "#FFF" : C.text }]}>
                {plan.popular ? "Start Free Trial" : "Choose Plan"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// ─── CALENDAR ──────────────────────────────────────────────

function CalendarScreen({ setTab }) {
  const monthsWithEvents = MONTHS
    .map((m, i) => ({ name: m, events: USER_EVENTS.filter((e) => e.month === i + 1) }))
    .filter((m) => m.events.length > 0);

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ alignItems: "center", paddingVertical: 20 }}>
        <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 24, color: C.text, marginBottom: 4 }}>Your Flower Calendar</Text>
        <Text style={{ fontSize: 14, color: C.textSoft, fontFamily: "DMSans_400Regular" }}>
          {USER_EVENTS.length} events scheduled this year
        </Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 20, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.green }} />
          <Text style={{ fontSize: 12, fontFamily: "DMSans_500Medium", color: C.text }}>Scheduled</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.textMuted }} />
          <Text style={{ fontSize: 12, fontFamily: "DMSans_500Medium", color: C.textSoft }}>Pending</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {monthsWithEvents.map((m) => (
          <View key={m.name} style={s.calMonth}>
            <Text style={s.calMonthName}>{m.name}</Text>
            {m.events.map((e, j) => (
              <View key={j} style={s.calEventRow}>
                <View style={[s.calDot, { backgroundColor: e.color }]} />
                <Text style={s.calEventName}>{e.name}</Text>
                <Text style={s.calEventDate}>{e.date}</Text>
                <View style={[s.calStatus, { backgroundColor: e.status === "Scheduled" ? C.greenLight : C.bg }]}>
                  <Text style={{ fontSize: 11, fontFamily: "DMSans_600SemiBold", color: e.status === "Scheduled" ? C.green : C.textMuted }}>
                    {e.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity style={s.addEventBtn} onPress={() => setTab("plans")} activeOpacity={0.8}>
          <Text style={{ fontSize: 15, fontFamily: "DMSans_600SemiBold", color: "#FFF" }}>+ Add New Event</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// ─── PROFILE ───────────────────────────────────────────────

function ProfileScreen() {
  const menuItems = [
    { icon: "📋", label: "My Subscription", desc: "Premium Petal · Active", bg: C.accentLight },
    { icon: "🌸", label: "Flower Preferences", desc: "Roses, Tulips, Peonies", bg: C.peachLight },
    { icon: "📍", label: "Delivery Address", desc: "123 Main St, Apt 4B", bg: C.lavenderLight },
    { icon: "💳", label: "Payment Method", desc: "•••• 4242", bg: C.greenLight },
    { icon: "🔔", label: "Notifications", desc: "Email & Push enabled", bg: "#FFF3E0" },
    { icon: "🎁", label: "Gift a Subscription", desc: "Send flowers to loved ones", bg: C.accentLight },
    { icon: "❓", label: "Help & Support", desc: "FAQ, Contact us", bg: C.bg },
  ];

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Avatar & Info */}
      <View style={{ alignItems: "center", paddingVertical: 24 }}>
        <View style={s.profileAvatar}>
          <Text style={{ fontSize: 32 }}>🌸</Text>
        </View>
        <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 22, color: C.text }}>Sarah Johnson</Text>
        <Text style={{ fontSize: 13, color: C.textSoft, fontFamily: "DMSans_400Regular", marginTop: 2 }}>sarah.j@email.com</Text>
      </View>

      {/* Stats */}
      <View style={s.profileStats}>
        {[
          { num: "8", label: "EVENTS" },
          { num: "23", label: "DELIVERIES" },
          { num: "3", label: "FAVORITES" },
        ].map((stat, i) => (
          <View key={i} style={{ alignItems: "center" }}>
            <Text style={{ fontFamily: "PlayfairDisplay_700Bold", fontSize: 24, color: C.accent }}>{stat.num}</Text>
            <Text style={{ fontSize: 11, fontFamily: "DMSans_500Medium", color: C.textMuted, letterSpacing: 0.8, marginTop: 2 }}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={s.profileMenuItem} activeOpacity={0.7}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
              <View style={[s.profileMenuIcon, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: "DMSans_600SemiBold", color: C.text }}>{item.label}</Text>
                <Text style={{ fontSize: 12, color: C.textSoft, fontFamily: "DMSans_400Regular" }}>{item.desc}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const [tab, setTab] = useState("home");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [favorites, setFavorites] = useState(new Set([1, 3]));

  const toggleFav = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 32 }}>🌸</Text>
      </View>
    );
  }

  const tabs = [
    { id: "home", icon: "home-outline", iconActive: "home", label: "Home" },
    { id: "plans", icon: "gift-outline", iconActive: "gift", label: "Plans" },
    { id: "map", icon: "map-outline", iconActive: "map", label: "Explore" },
    { id: "calendar", icon: "calendar-outline", iconActive: "calendar", label: "Calendar" },
    { id: "profile", icon: "person-outline", iconActive: "person", label: "Profile" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <MaterialCommunityIcons name="flower-tulip-outline" size={26} color={C.accent} />
          <Text style={s.headerTitle}>Flowerly</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <TouchableOpacity style={s.iconBtn} onPress={() => setTab("map")}>
            <Ionicons name="search-outline" size={18} color={C.textSoft} />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}>
            <Ionicons name="bag-handle-outline" size={18} color={C.textSoft} />
            <View style={s.badge} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Content */}
      {tab === "home" && (
        <HomeScreen
          setTab={setTab}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          favorites={favorites}
          toggleFav={toggleFav}
          setSelectedShop={setSelectedShop}
        />
      )}
      {tab === "plans" && <PlansScreen onSubscribe={() => setShowConfirmation(true)} />}
      {tab === "map" && <MapScreen favorites={favorites} toggleFav={toggleFav} setSelectedShop={setSelectedShop} />}
      {tab === "calendar" && <CalendarScreen setTab={setTab} />}
      {tab === "profile" && <ProfileScreen />}

      {/* Bottom Tab Bar */}
      <View style={s.bottomNav}>
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <TouchableOpacity key={t.id} style={s.navItem} onPress={() => setTab(t.id)} activeOpacity={0.7}>
              {active && <View style={s.activeDot} />}
              <Ionicons name={active ? t.iconActive : t.icon} size={22} color={active ? C.accent : C.textMuted} />
              <Text style={[s.navLabel, active && { color: C.accent }]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modals */}
      <ShopDetailModal
        shop={selectedShop}
        visible={!!selectedShop}
        onClose={() => setSelectedShop(null)}
        isFav={selectedShop ? favorites.has(selectedShop.id) : false}
        onToggleFav={() => selectedShop && toggleFav(selectedShop.id)}
        onSubscribe={() => { setSelectedShop(null); setShowConfirmation(true); }}
      />
      <ConfirmationModal
        visible={showConfirmation}
        onDone={() => { setShowConfirmation(false); setTab("calendar"); }}
      />
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════

const s = StyleSheet.create({
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  headerTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: C.accent,
    letterSpacing: -0.3,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.accent,
    borderWidth: 2,
    borderColor: C.bg,
  },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.card,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  // Event Chips
  eventChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: C.card,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

  // Banners
  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
  },

  // Shop Cards
  shopCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  shopCardTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  shopAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  shopName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 17,
    color: C.text,
  },
  shopAddress: {
    fontSize: 12.5,
    color: C.textSoft,
    fontFamily: "DMSans_400Regular",
    marginTop: 1,
  },

  // Map
  mapPinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  mapPopup: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },

  // Plans
  planCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  planBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: C.accent,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  planName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 20,
    marginBottom: 2,
  },
  planDesc: {
    fontSize: 13,
    color: C.textSoft,
    fontFamily: "DMSans_400Regular",
    marginBottom: 14,
  },
  planPrice: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 32,
  },
  planCta: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 18,
  },
  planCtaText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },

  // Calendar
  calMonth: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  calMonthName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 17,
    color: C.text,
    marginBottom: 10,
  },
  calEventRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  calDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  calEventName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: C.text,
  },
  calEventDate: {
    fontSize: 12,
    color: C.textMuted,
    fontFamily: "DMSans_400Regular",
  },
  calStatus: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  addEventBtn: {
    backgroundColor: C.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },

  // Profile
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
    // Gradient approximation
    backgroundColor: C.accent,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    marginHorizontal: 20,
    backgroundColor: C.card,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: C.card,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  profileMenuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  navItem: {
    alignItems: "center",
    gap: 3,
    paddingVertical: 4,
    paddingHorizontal: 14,
    position: "relative",
  },
  activeDot: {
    position: "absolute",
    top: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  navLabel: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.3,
    color: C.textMuted,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHero: {
    height: 120,
    borderRadius: 16,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  bouquetCard: {
    width: (SCREEN_W - 50) / 2 - 5,
    backgroundColor: C.card,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  modalCta: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Confirmation
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "85%",
    maxWidth: 320,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.greenLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  confirmTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 22,
    color: C.text,
    marginBottom: 8,
  },
  confirmDesc: {
    fontSize: 14,
    color: C.textSoft,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  confirmBtn: {
    width: "100%",
    backgroundColor: C.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
