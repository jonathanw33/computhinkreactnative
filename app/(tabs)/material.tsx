import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView style={styles.scrollView}>
        <ImageBackground 
          source={require('../../assets/images/blog_details_hero_bg.jpeg')}
          style={styles.pageHeading}
        >
          <Text style={styles.pageTitle}>Understanding Algorithm Design</Text>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <View style={styles.postContainer}>
            <View style={styles.postThumb}>
              <Image
                source={require('../../assets/images/material1.jpeg')}
                style={styles.postImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.postInfo}>
              <Text style={styles.postedBy}>15 Nov 2024</Text>
              <Text style={styles.postTitle}>
                The Essentials of Algorithm Design in Computational Thinking
              </Text>
              
              <Text style={styles.paragraph}>
                Algorithm design is a fundamental aspect of computational thinking, enabling us to devise clear, efficient, and systematic approaches to problem-solving. This involves breaking down complex problems into manageable steps, allowing for effective solutions.
              </Text>

              <View style={styles.blockquote}>
                <Text style={styles.blockquoteText}>
                  "Algoritma adalah suatu rangkaian terhingga dari instruksi-instruksi yang terdefinisi dan
                  dapat diimplementasikan pada komputer untuk menyelesaikan himpunan permasalahan
                  spesifik yang computable."
                </Text>
                <Text style={styles.blockquoteAuthor}>Riza Satria Perdana</Text>
              </View>

              <Text style={styles.paragraph}>
                In computational thinking, effective algorithm design is crucial as it allows us to create solutions that are not only correct but also efficient and scalable. This is particularly important in software development and data processing, where performance can significantly impact user experience.
              </Text>

              <Text style={styles.heading}>Key Principles of Algorithm Design</Text>
              <Text style={styles.paragraph}>When designing algorithms, several key principles must be considered:</Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Efficiency:</Text> The algorithm should make optimal use of resources, including time and memory.</Text>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Correctness:</Text> It must produce the correct output for all possible inputs.</Text>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Scalability:</Text> The design should accommodate increasing amounts of data without performance degradation.</Text>
              </View>

              <Text style={styles.heading}>Types of Algorithms</Text>
              <Text style={styles.paragraph}>
                Algorithms can be categorized into various types based on their functionality and application. Here are a few common types:
              </Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Sorting Algorithms:</Text> These algorithms arrange elements of a list in a certain order.</Text>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Search Algorithms:</Text> These algorithms are used to find specific data within a structure.</Text>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Graph Algorithms:</Text> These algorithms are designed to solve problems related to graph theory.</Text>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Dynamic Programming:</Text> This method solves complex problems by breaking them down into simpler subproblems.</Text>
              </View>

              <Text style={styles.heading}>Applications of Algorithms</Text>
              <Text style={styles.paragraph}>Algorithms are integral to various fields and applications:</Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Data Analysis:</Text> Algorithms help in processing and analyzing large datasets.</Text>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Machine Learning:</Text> Algorithms are the backbone of machine learning models.</Text>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Networking:</Text> Algorithms manage data transmission and routing in networks.</Text>
                <Text style={styles.listItem}>• <Text style={styles.strong}>Cryptography:</Text> Algorithms secure data through encryption and decryption processes.</Text>
              </View>

              <Text style={styles.heading}>Conclusion</Text>
              <Text style={styles.paragraph}>
                In conclusion, algorithm design is a critical skill in the realm of computer science and software development. By understanding the principles, types, and applications of algorithms, individuals can enhance their problem-solving capabilities and contribute to the creation of efficient, scalable solutions.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  pageHeading: {
    width: '100%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  pageTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  postContainer: {
    backgroundColor: '#000',
    borderRadius: 15,
  },
  postThumb: {
    marginBottom: 45,
    borderRadius: 15,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
  },
  postInfo: {
    padding: 20,
  },
  postedBy: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
    fontWeight: '600',
  },
  postTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    lineHeight: 46,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 28,
    color: '#ccc',
    marginBottom: 45,
  },
  blockquote: {
    backgroundColor: '#111',
    padding: 40,
    borderLeftWidth: 5,
    borderLeftColor: '#FF4A17',
    marginBottom: 45,
  },
  blockquoteText: {
    fontSize: 18,
    lineHeight: 34,
    color: '#fff',
    fontWeight: '600',
  },
  blockquoteAuthor: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    paddingLeft: 35,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
  },
  listContainer: {
    marginBottom: 45,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 28,
    color: '#ccc',
    marginBottom: 10,
    paddingLeft: 15,
  },
  strong: {
    fontWeight: 'bold',
    color: '#fff',
  },
});