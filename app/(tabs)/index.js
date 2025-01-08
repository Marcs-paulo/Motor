import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, useColorScheme, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { db } from '../../components/config';

import { ref, onValue, set } from 'firebase/database';

const MotorScreen = () => {
  const [motorState, setMotorState] = useState('desligado');
  const [usersState, setUsersState] = useState({
    Dedé: false,
    Claudeilson: false,
    'Zé Dito': false,
  });

  const [scale] = useState(new Animated.Value(1));

  const animateButton = (toValue) => {
    Animated.spring(scale, {
      toValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const colorScheme = useColorScheme();

  useEffect(() => {
    const motorRef = ref(db, '/motor/Estado');
    const unsubscribe = onValue(motorRef, (snapshot) => {
      setMotorState(snapshot.val() || 'desligado');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const usersRef = ref(db, '/motor');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setUsersState({
        Dedé: data.Dedé || false,
        Claudeilson: data.Claudeilson || false,
        'Zé Dito': data['Zé Dito'] || false,
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!Object.values(usersState).includes(true)) {
      set(ref(db, '/motor/Estado'), 'desligado');
    }
  }, [usersState]);

  const toggleMotor = () => {
    if (!Object.values(usersState).includes(true)) {
      Alert.alert('Atenção', 'Você precisa ativar pelo menos um usuário antes de ligar o motor.');
      return;
    }

    const newState = motorState === 'desligado' ? 'ligado' : 'desligado';
    set(ref(db, '/motor/Estado'), newState);
  };

  const toggleUser = (user) => {
    const newUserState = !usersState[user];
    set(ref(db, `/motor/${user}`), newUserState);
  };

  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      {/* Adiciona a imagem acima do título */}
      <Image
        source={{ uri: 'file:///D:/Casa/MOTOR/assets/images/Motor1.png' }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Controle do Motor</Text>

      <Text style={styles.subtitle}>Estado do motor: {motorState.toUpperCase()}</Text>

      <Animated.View style={[styles.powerButton, { transform: [{ scale }] }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: motorState === 'ligado' ? '#FF6B6B' : '#4CAF50' }]}
          onPressIn={() => animateButton(0.9)}
          onPressOut={() => animateButton(1)}
          onPress={toggleMotor}
          activeOpacity={0.7}
        >
          <MaterialIcons name="power-settings-new" size={80} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.usersContainer}>
        {Object.keys(usersState).map((user) => (
          <TouchableOpacity
            key={user}
            style={[
              styles.userButton,
              { backgroundColor: usersState[user] ? '#4CAF50' : '#B0BEC5' },
            ]}
            onPress={() => toggleUser(user)}
            activeOpacity={0.7}
          >
            <Text style={styles.userButtonText}>{user}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const getStyles = (colorScheme) => {
  const isDarkMode = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#212121' : '#ECEFF1',
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    image: {
      width: 200, // Ajuste o tamanho da imagem
      height: 200,
      marginBottom: 20, // Espaço entre a imagem e o título
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#37474F',
      marginBottom: 25,
    },
    subtitle: {
      fontSize: 20,
      color: isDarkMode ? '#B0BEC5' : '#546E7A',
      marginBottom: 30,
    },
    powerButton: {
      width: 140,
      height: 140,
      borderRadius: 70,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 18,
    },
    button: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 70,
    },
    usersContainer: {
      width: '100%',
      marginTop: 30,
    },
    userButton: {
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 15,
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 15,
    },
    userButtonText: {
      color: isDarkMode ? '#FFFFFF' : '#000000',
      fontWeight: '600',
      fontSize: 18,
    },
  });
};

export default MotorScreen;
