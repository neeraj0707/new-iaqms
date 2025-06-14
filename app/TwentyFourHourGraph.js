import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

let dbInstance = null;

const openDb = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('aqi_data.db');
  }
  return dbInstance;
};

const TwentyFourHourGraph = () => {
  const [aqiData, setAqiData] = useState([]);

  useEffect(() => {
    // const fetchData = async () => {
    //   const db = await openDb();
    //   const now = new Date();
    //   const past24Hrs = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    //   const allRows = await db.getAllAsync('SELECT * FROM aqi_data');
    //   const filtered = allRows.filter((row) => {
    //     const dt = new Date(
    //       row.datetime.split(' ')[2], // year
    //       row.datetime.split(' ')[1] - 1, // month
    //       row.datetime.split(' ')[0], // day
    //       ...row.datetime.split(' ')[1]?.split(':').map(Number) // time
    //     );
    //     return dt >= past24Hrs && dt <= now;
    //   });

    //   const sortedData = filtered.sort(
    //     (a, b) => new Date(a.datetime) - new Date(b.datetime)
    //   );

    //   setAqiData(sortedData);
    // };

    const fetchData = async () => {
  const db = await openDb();
  const now = new Date();
  const past24Hrs = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const allRows = await db.getAllAsync('SELECT * FROM aqi_data');

  const filtered = allRows.filter((row) => {
    const [datePart, timePart] = row.datetime.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    const rowDate = new Date(year, month - 1, day, hours, minutes, seconds);
    return rowDate >= past24Hrs && rowDate <= now;
  });

  const sortedData = filtered.sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime)
  );
  console.log('Filtered:', filtered.map(d => d.datetime));


  setAqiData(sortedData);
};

    fetchData();
  }, []);

  const chartData = {
    labels: aqiData.map((d, idx) =>
      idx % 3 === 0 ? d.datetime.split(' ')[1] : ''
    ),
    datasets: [
      {
        data: aqiData.map((d) => parseFloat(d.aqi || 0)),
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Last 24 Hours AQI Trend</Text>
      {aqiData.length > 0 ? (
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 20}
          height={220}
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f0f0f0',
            backgroundGradientTo: '#e0e0e0',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '1',
              stroke: '#1e90ff',
            },
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noData}>No data for past 24 hours</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginLeft: 10,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default TwentyFourHourGraph;
