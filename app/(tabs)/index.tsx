import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');
    setWeather(null);
    try {
      const res = await fetch(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`
      );
      const data = await res.json();
      console.log('DATA:', JSON.stringify(data).slice(0, 200));
      setWeather(data);
    } catch (e) {
      console.log('ERROR:', e);
      setError('City not found. Try again!');
    }
    setLoading(false);
  };

  const getEmoji = (code) => {
    code = parseInt(code);
    if (code === 113) return '☀️';
    if (code === 116) return '⛅';
    if ([119, 122].includes(code)) return '☁️';
    if ([143, 248, 260].includes(code)) return '🌫️';
    if ([176, 263, 266, 293, 296].includes(code)) return '🌦️';
    if ([299, 302, 305, 308].includes(code)) return '🌧️';
    if ([200, 386, 389].includes(code)) return '⛈️';
    if ([179, 227, 230, 329, 332].includes(code)) return '❄️';
    return '🌡️';
  };

  const current = weather?.current_condition?.[0];
  const area = weather?.nearest_area?.[0];
  const cityName = area?.areaName?.[0]?.value || city;
  const country = area?.country?.[0]?.value || '';

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>🌤️ WeatherApp</Text>
        <Text style={styles.subtitle}>Search any city in the world</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter city name..."
            placeholderTextColor="#aaa"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={fetchWeather}
          />
          <TouchableOpacity style={styles.button} onPress={fetchWeather}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {current && (
          <View style={styles.card}>
            <Text style={styles.emoji}>{getEmoji(current.weatherCode)}</Text>
            <Text style={styles.cityName}>{cityName}, {country}</Text>
            <Text style={styles.temp}>{current.temp_C}°C</Text>
            <Text style={styles.description}>{current.weatherDesc?.[0]?.value}</Text>

            <View style={styles.divider} />

            <View style={styles.detailsRow}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Feels Like</Text>
                <Text style={styles.detailValue}>{current.FeelsLikeC}°C</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{current.humidity}%</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>Wind</Text>
                <Text style={styles.detailValue}>{current.windspeedKmph} km/h</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1B2D' },
  inner: { flexGrow: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#aaa', marginBottom: 30 },
  inputRow: { flexDirection: 'row', width: '100%', marginBottom: 30 },
  input: { flex: 1, backgroundColor: '#1E2D40', color: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginRight: 10 },
  button: { backgroundColor: '#4A90E2', borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  error: { color: '#FF6B6B', fontSize: 15, marginTop: 20 },
  card: { width: '100%', backgroundColor: '#1E2D40', borderRadius: 20, padding: 28, alignItems: 'center', marginTop: 10 },
  emoji: { fontSize: 64, marginBottom: 10 },
  cityName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  temp: { fontSize: 56, fontWeight: 'bold', color: '#4A90E2', marginBottom: 4 },
  description: { fontSize: 16, color: '#aaa', textTransform: 'capitalize', marginBottom: 20 },
  divider: { width: '100%', height: 1, backgroundColor: '#2E4057', marginBottom: 20 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  detailBox: { alignItems: 'center', flex: 1 },
  detailLabel: { fontSize: 12, color: '#aaa', marginBottom: 4 },
  detailValue: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});