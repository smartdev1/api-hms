import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await login(email, password);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erreur de connexion API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HMIS Tracking</Text>
      <Text style={styles.subtitle}>Espace Établissement</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email ou Téléphone"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Connexion</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#10B981', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#A1A1AA', textAlign: 'center', marginBottom: 48 },
  inputContainer: { gap: 16, marginBottom: 32 },
  input: { backgroundColor: '#18181B', borderRadius: 12, padding: 16, color: '#FFF', fontSize: 16, borderWidth: 1, borderColor: '#27272A' },
  button: { backgroundColor: '#10B981', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#EF4444', textAlign: 'center', marginBottom: 16 }
});
