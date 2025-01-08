import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { db } from './config';
import { ref, onValue, set } from 'firebase/database';

const MotorScreen = () => {
  const [motorState, setMotorState] = useState('desligado');
  const [usersState, setUsersState] = useState({
    Dedé: false,
    Claudeilson: false,
    'Zé Dito': false,
  });

  // Monitorando o estado do motor no Firebase
  useEffect(() => {
    const motorRef = ref(db, '/motor/Estado');
    const unsubscribe = onValue(motorRef, (snapshot) => {
      setMotorState(snapshot.val() || 'desligado');
    });
    return () => unsubscribe();
  }, []);

  // Monitorando o estado dos usuários no Firebase
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

  // Alternar estado do motor
  const toggleMotor = () => {
    if (!Object.values(usersState).includes(true)) {
      Alert.alert('Atenção', 'Você precisa ativar pelo menos um usuário antes de ligar o motor.');
      return;
    }

    const newState = motorState === 'desligado' ? 'ligado' : 'desligado';
    set(ref(db, '/motor/Estado'), newState);
  };

  // Alternar estado de um usuário
  const toggleUser = (user) => {
    const newUserState = !usersState[user];
    set(ref(db, `/motor/${user}`), newUserState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motor</Text>

      <Text style={styles.subtitle}>Estado do motor: {motorState.toUpperCase()}</Text>

      <TouchableOpacity
        style={[
          styles.powerButton,
          { backgroundColor: motorState === 'ligado' ? 'red' : 'green' },
        ]}
        onPress={toggleMotor}
      >
        <MaterialIcons name="power-settings-new" size={80} color="white" />
      </TouchableOpacity>

      <View style={styles.usersContainer}>
        {Object.keys(usersState).map((user) => (
          <TouchableOpacity
            key={user}
            style={[
              styles.userButton,
              { backgroundColor: usersState[user] ? 'green' : 'gray' },
            ]}
            onPress={() => toggleUser(user)}
          >
            <Text style={styles.userButtonText}>{user}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  powerButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  usersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  userButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  userButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MotorScreen;
