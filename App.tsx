import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';

// Define TypeScript interfaces
interface ParkingSpot {
  id: string;
  name: string;
  location: string;
  drivingTime: number;
  available: boolean;
  price?: string;
}

interface SearchParams {
  destination: string;
  timeConstraint: number;
}

// Mock data
const MOCK_PARKING_SPOTS: ParkingSpot[] = [
  // Munich
  {
    id: '1',
    name: 'Parkhaus Altstadt',
    location: 'Altstadt, Munich',
    drivingTime: 10,
    available: true,
    price: '€7'
  },
  {
    id: '2',
    name: 'P+R Fröttmaning',
    location: 'Fröttmaning, Munich',
    drivingTime: 18,
    available: true,
    price: '€1'
  },

  // Berlin
  {
    id: '3',
    name: 'Alexa Parking',
    location: 'Alexanderplatz, Berlin',
    drivingTime: 8,
    available: true,
    price: '€6'
  },
  {
    id: '4',
    name: 'Mall of Berlin Garage',
    location: 'Leipziger Platz, Berlin',
    drivingTime: 15,
    available: true,
    price: '€5'
  },

  // Hamburg
  {
    id: '5',
    name: 'Contipark Tiefgarage',
    location: 'Hafencity, Hamburg',
    drivingTime: 12,
    available: true,
    price: '€4'
  },
  {
    id: '6',
    name: 'Q-Park City',
    location: 'Innenstadt, Hamburg',
    drivingTime: 20,
    available: true,
    price: '€3'
  },

  // Frankfurt
  {
    id: '7',
    name: 'MyZeil Parkhaus',
    location: 'Zeil, Frankfurt',
    drivingTime: 9,
    available: true,
    price: '€6'
  },
  {
    id: '8',
    name: 'Hauptbahnhof Parkdeck',
    location: 'Frankfurt Central Station',
    drivingTime: 14,
    available: true,
    price: '€5'
  },

  // Cologne
  {
    id: '9',
    name: 'Dom Garage',
    location: 'Cologne Cathedral',
    drivingTime: 7,
    available: true,
    price: '€6'
  },
  {
    id: '10',
    name: 'Lanxess Arena Parking',
    location: 'Deutz, Cologne',
    drivingTime: 16,
    available: true,
    price: '€4'
  },

  // Stuttgart
  {
    id: '11',
    name: 'Milaneo Center Parking',
    location: 'Stuttgart Mitte',
    drivingTime: 10,
    available: true,
    price: '€5'
  },
  {
    id: '12',
    name: 'Airport Parking',
    location: 'Stuttgart Airport',
    drivingTime: 25,
    available: true,
    price: '€8'
  },

  // Düsseldorf
  {
    id: '13',
    name: 'Kö-Bogen Parkhaus',
    location: 'Königsallee, Düsseldorf',
    drivingTime: 11,
    available: true,
    price: '€6'
  },
  {
    id: '14',
    name: 'Altstadt Garage',
    location: 'Old Town, Düsseldorf',
    drivingTime: 13,
    available: true,
    price: '€4'
  },

  // Leipzig
  {
    id: '15',
    name: 'Höfe am Brühl',
    location: 'Zentrum, Leipzig',
    drivingTime: 9,
    available: true,
    price: '€3'
  },
  {
    id: '16',
    name: 'Parkhaus Augustusplatz',
    location: 'Leipzig University',
    drivingTime: 17,
    available: true,
    price: '€4'
  }
];

// Regex to parse command input
// Example command: "find parking near Munich in 30 minutes"
const parseCommand = (command: string): SearchParams => {
  const locationMatch = command.match(/to\s+(\w+)|near\s+(\w+)/i);
  const timeMatch = command.match(/(\d+)\s+minutes/);

  return {
    destination: locationMatch ? (locationMatch[1] || locationMatch[2] || 'Munich') : 'Munich',
    timeConstraint: timeMatch ? parseInt(timeMatch[1], 10) : 30
  };
};

const ParkingSpotItem: React.FC<{
  item: ParkingSpot;
  onReserve: (id: string) => void;
}> = ({ item, onReserve }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{item.name}</Text>
    <Text>📍 {item.location}</Text>
    <Text>⏱️ {item.drivingTime} minutes away</Text>
    <Text>{item.available ? '✅ Available' : '❌ Unavailable'}</Text>
    {item.price && <Text>💰 {item.price}</Text>}
    <Button
      title="Reserve"
      onPress={() => onReserve(item.id)}
      disabled={!item.available}
    />
  </View>
);

export default function App() {
  const [command, setCommand] = useState<string>('');
  const [results, setResults] = useState<ParkingSpot[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const handleSearch = () => {
    const params = parseCommand(command.trim());
    setSearchParams(params);

    // Normalize destination string for comparison
    const dest = params.destination.toLowerCase();

    const filteredResults = MOCK_PARKING_SPOTS
      .filter((spot) => {
        const location = spot.location.toLowerCase();
        const isOnRoute = location.includes(dest); // route match
        const isWithinTime = spot.drivingTime <= params.timeConstraint;

        return spot.available && isOnRoute && isWithinTime;
      })
      .sort((a, b) => a.drivingTime - b.drivingTime); // prioritize closer results

    setResults(filteredResults);
  };

  const handleReserve = (id: string) => {
    Alert.alert('Reservation Confirmed', 'Parking spot reserved successfully!');
    // In a real app: API call to update reservation status
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cargovibe Parking Finder</Text>
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Find parking near Munich in 30 minutes"
          value={command}
          onChangeText={setCommand}
          onSubmitEditing={handleSearch}
        />
        <Button title="Find Parking" onPress={handleSearch} />

        {searchParams && (
          <Text style={styles.resultsHeader}>
            Parking near {searchParams.destination} {searchParams.timeConstraint} minutes:
          </Text>
        )}

        <FlatList
          data={results}
          renderItem={({ item }) => <ParkingSpotItem item={item} onReserve={handleReserve} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text>No available parking spots found</Text>}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  resultsHeader: {
    fontSize: 17,
    marginTop: 20,
    marginBottom: 12,
    fontWeight: '600',
    color: '#444',
  },
  listContent: {
    paddingBottom: 20,
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },

  header: {
    height: 60,
    backgroundColor: '#F8F8F8',
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // for Android
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },


});