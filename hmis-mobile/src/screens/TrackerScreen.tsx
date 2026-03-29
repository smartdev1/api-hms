import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function TrackerScreen() {
  const { user, logout } = useAuth();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isTracking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
        ])
      ).start();
      startRecordingLogic();
    } else {
      pulseAnim.setValue(1);
      stopRecordingLogic(false);
    }
    
    return () => { stopRecordingLogic(false); };
  }, [isTracking]);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      alert("Permission d'accès au micro refusée.");
      return false;
    }
    return true;
  };

  const startRecordingLogic = async () => {
    const perm = await requestPermissions();
    if (!perm) { setIsTracking(false); return; }
    
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      
      // Auto-stop and send every 30s if tracking remains active
      setTimeout(() => {
        if (isTracking) {
           stopRecordingLogic(true); // send current
           startRecordingLogic(); // start next chunk
        }
      }, 30000);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecordingLogic = async (send: boolean) => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (send && uri) sendToApi(uri);
    }
  };

  const sendToApi = async (fileUri: string) => {
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: fileUri,
        name: `capture-${Date.now()}.m4a`,
        type: 'audio/m4a'
      } as any);
      
      formData.append('etablissement_id', user?.id || 'default');
      formData.append('duree_secondes', '30');
      formData.append('timestamp_capture', new Date().toISOString());

      await api.post('/audio/capturer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Capture relayée à l api avec succès');
    } catch(e) {
      console.error('Erreur Upload Native', e);
      // Mode offline: on enregistrera l'URI dans AsyncStorage et relancera via /sync plus tard
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HMIS Tracking</Text>
      
      <Text style={styles.status}>{isTracking ? '🎧 Écoute de l\'environnement...' : '⏹ En attente'}</Text>
      
      <TouchableOpacity onPress={() => setIsTracking(!isTracking)} activeOpacity={0.8}>
        <Animated.View style={[styles.buttonRing, { transform: [{ scale: pulseAnim }], borderColor: isTracking ? '#EF4444' : '#3F3F46' }]}>
          <View style={[styles.buttonInner, { backgroundColor: isTracking ? '#EF4444' : '#27272A' }]}>
            <Text style={styles.buttonText}>{isTracking ? 'STOP' : 'START'}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', position: 'absolute', top: 60 },
  status: { color: '#A1A1AA', fontSize: 18, marginBottom: 60 },
  buttonRing: { width: 220, height: 220, borderRadius: 110, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  buttonInner: { width: 180, height: 180, borderRadius: 90, alignItems: 'center', justifyContent: 'center', elevation: 10 },
  buttonText: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
  logoutBtn: { position: 'absolute', bottom: 40 },
  logoutText: { color: '#EF4444', fontSize: 16 }
});
