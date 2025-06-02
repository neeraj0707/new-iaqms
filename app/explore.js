
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';



const ExploreTab = () => {
  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Introduction */}
      <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
  <Text
    style={{
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'rgb(8, 39, 97)',
      textAlign: 'center', // Center the text itself
    }}
  >
    Monitoring air quality is just the beginning. Real challenge comes from interpreting the data and turning it into meaningful action.
  </Text>
</View>

      {/* <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 , color:"rgb(8, 39, 97) "}}>Monitoring air quality is just the beginning. Real challenge comes from interpreting the data and turning it into meaningful action.</Text> */}
      <Text style={{ fontSize: 20, lineHeight: 24 , color:"rgb(19, 104, 214) "}}>
        Tecsage offers commercial air quality monitoring solutions with intelligent software analytics and a dedicated team of IAQMS experts to help you understand and enhance your indoor environment.
      </Text>

      {/* <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
  <Text
    style={{
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: 'rgb(14, 82, 207)',
      textAlign: 'center', // Center the text itself
    }}
  >
            Tecsage offers commercial air quality monitoring solutions with intelligent software analytics and a dedicated team of IAQMS experts to help you understand and enhance your indoor environment.

  </Text>
</View> */}


      {/* How IoT Devices Work */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 28 }}>How Our Devices Work ?</Text>
        <Text style={{ fontSize: 18, marginTop: 10 }}>
          Our smart IoT devices use advanced sensors to detect air quality pollutants in real-time, sending 
          data directly to your app to monitor your environment and take control of your indoor air quality.
        </Text>
        <Image source={require('../assets/aqms3.png')} style={{ width: '100%', height: 200, marginTop: 10 }} />
      </View>

      {/* Educational Tips */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 28 }}>Tips for Better Air Quality</Text>
        <Text style={{ fontSize: 16, marginTop: 10 ,}}>
          1. Use an air purifier to reduce pollutants.{"\n"}
          2. Increase ventilation to reduce CO2 level.{"\n"}
          3. Monitor humidity levels to avoid excess moisture.
        </Text>
      </View>

      {/* Product Features */}
      <View style={{ marginTop: 20 , }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>For more details explore our website </Text>
        {/* <Text>Find the right device for your needs: </Text> */}
        <TouchableOpacity onPress={() => {/* Navigate to product details */}}>
          {/* <Text style={{ color: '#007bff', marginTop: 10 }}>View our product range</Text> */}
        </TouchableOpacity>
      </View>


      

    
      {/* <TouchableOpacity style={{ marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginBottom: 150 }}>
        <Text style={{ color: '#fff', fontSize: 16 , }}>a</Text>
      </TouchableOpacity> */}

      <TouchableOpacity onPress={() => Linking.openURL('https://tecsageinnovations.com/')}>
  <Text style={{ color: 'blue', textDecorationLine: 'underline' , marginBottom: 150}}>
    Visit Our Website
  </Text>
</TouchableOpacity>

    </ScrollView>
  );
};

export default ExploreTab;
