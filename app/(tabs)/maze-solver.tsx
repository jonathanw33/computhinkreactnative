import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../context/auth';
import { getManagementApiToken, getAccessTokenSilently } from '@/utils/auth';

const storage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  }
};


const { width } = Dimensions.get('window');
const CELL_SIZE = 20;

interface MazeState {
  rows: number;
  cols: number;
  algorithm: 'dfs' | 'bfs';
  solving: boolean;
  status: string;
  showSettings: boolean;
}

export default function MazeSolver() {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    console.log("Current user:", user);
    console.log("User ID:", user?.sub);
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await storage.getItem('auth_token');
      console.log('Auth State:', {
        isAuthenticated,
        user,
        hasToken: !!token
      });
    };
    checkAuth();
  }, [isAuthenticated, user]);
  
  // State management
  const [maze, setMaze] = useState<number[][]>([]);
  const [currentPath, setCurrentPath] = useState<number[][]>([]);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [state, setState] = useState<MazeState>({
    rows: 15,
    cols: 15,
    algorithm: 'dfs',
    solving: false,
    status: '',
    showSettings: false,
  });

  const canvasWidth = (state.cols + 2) * CELL_SIZE;
  const canvasHeight = (state.rows + 2) * CELL_SIZE;

  // Algorithm descriptions
  const algorithmDescriptions = {
    dfs: "Depth-First Search (DFS) explores as far as possible along each branch before backtracking.",
    bfs: "Breadth-First Search (BFS) explores all neighbor cells before moving to the next level."
  };

  // Maze generation functions
  const initMaze = (rows: number, cols: number) => {
    return Array(rows + 2).fill(null).map(() => Array(cols + 2).fill(1));
  };

  const MazeRenderer = () => {
    return (
      <View style={{ width: canvasWidth, height: canvasHeight }}>
        {maze.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={{ flexDirection: 'row' }}>
            {row.map((cell, colIndex) => {
              const isVisited = visited.has(`${rowIndex},${colIndex}`);
              const isPath = currentPath.some(([r, c]) => r === rowIndex && c === colIndex);
              
              return (
                <View
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: isPath ? 'rgba(0, 255, 0, 0.5)' :
                                   isVisited ? 'rgba(255, 0, 0, 0.25)' :
                                   cell === 1 ? '#000000' : '#FFFFFF',
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  useEffect(() => {
    handleGenerateNewMaze();
  }, []);

  const generateMaze = async (row: number, col: number, newMaze: number[][]) => {
    const directions = [
      [0, 2],  // right
      [2, 0],  // down
      [0, -2], // left
      [-2, 0]  // up
    ].sort(() => Math.random() - 0.5);
    
    newMaze[row][col] = 0;
    
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      
      if (newRow >= 1 && newRow < newMaze.length - 1 && 
          newCol >= 1 && newCol < newMaze[0].length - 1 && 
          newMaze[newRow][newCol] === 1) {
        
        newMaze[row + dx/2][col + dy/2] = 0;
        newMaze[newRow][newCol] = 0;
        setMaze([...newMaze]);
        await new Promise(resolve => setTimeout(resolve, 10));
        await generateMaze(newRow, newCol, newMaze);
      }
    }
  };

  const dfs = async (row: number, col: number, visited: Set<string>, path: number[][]) => {
    const endRow = maze.length - 2;
    const endCol = maze[0].length - 2;
  
    if (row < 1 || row > endRow || col < 1 || col > endCol ||
        maze[row][col] === 1 || visited.has(`${row},${col}`)) {
      return false;
    }
  
    visited.add(`${row},${col}`);
    path.push([row, col]);
    setCurrentPath([...path]);
    setVisited(new Set(visited));
  
    if (row === endRow && col === endCol) {
      return true;
    }
  
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
  
      await new Promise(resolve => setTimeout(resolve, 10));
  
      if (await dfs(newRow, newCol, visited, path)) {
        return true;
      }
    }
  
    path.pop();
    setCurrentPath([...path]);
    return false;
  };
  
  const bfs = async () => {
    const endRow = maze.length - 2;
    const endCol = maze[0].length - 2;
    const queue: [number, number, number[][]][] = [[1, 1, [[1, 1]]]];
    const visited = new Set(['1,1']);
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  
    while (queue.length > 0) {
      const [row, col, path] = queue.shift()!;
  
      if (row === endRow && col === endCol) {
        return path;
      }
  
      for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        const newPos = `${newRow},${newCol}`;
  
        if (newRow >= 1 && newRow <= endRow && 
            newCol >= 1 && newCol <= endCol && 
            maze[newRow][newCol] === 0 && 
            !visited.has(newPos)) {
          
          visited.add(newPos);
          const newPath = [...path, [newRow, newCol]];
          queue.push([newRow, newCol, newPath]);
  
          setVisited(new Set(visited));
          setCurrentPath(newPath);
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
    }
    return null;
  };
  
  const handleGenerateNewMaze = async () => {
    if (state.solving) return;
    
    if (state.rows < 5 || state.rows > 50 || state.cols < 5 || state.cols > 50) {
      setState(prev => ({ ...prev, status: 'Please enter valid dimensions (5-50)' }));
      return;
    }
  
    setState(prev => ({ ...prev, status: 'Generating maze...' }));
    const newMaze = initMaze(state.rows, state.cols);
    setMaze(newMaze);
    setVisited(new Set());
    setCurrentPath([]);
    
    await generateMaze(1, 1, newMaze);
    
    newMaze[1][1] = 0;
    newMaze[state.rows][state.cols] = 0;
    newMaze[state.rows][state.cols-1] = 0;
    newMaze[state.rows-1][state.cols] = 0;
    
    setMaze(newMaze);
    setState(prev => ({ ...prev, status: 'Maze generated!' }));
  };

  const [userStats, setUserStats] = useState<{
    mazesSolved: number;
    solveHistory: Array<{
      date: string;
      algorithm: string;
      timeToSolve: number;
      mazeSize: { rows: number; cols: number };
    }>;
  } | null>(null);

  const auth0Domain = 'dev-yyxwjv0qx8jvs6dy.us.auth0.com';
  
  const getAuthToken = async () => {
    try {
      const token = await storage.getItem('auth_token');
      if (!token) {
        throw new Error('No auth token found');
      }
      // Ensure token is in proper Bearer format
      return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  };

  const auth0ClientId = '35VyC5zTT00MnLgiW1qoO8sCRYA6pnnK';

  interface SolveData {
    date: string;
    algorithm: string;
    timeToSolve: number;
    mazeSize: {
      rows: number;
      cols: number;
    };
  }
  
  interface UserMetadata {
    mazesSolved?: number;
    solveHistory?: SolveData[];
  }
  

  const updateUserStats = async (solveData: SolveData) => {
    try {
      if (!user?.sub) {
        throw new Error('No user ID found');
      }

      const token = await getAccessTokenSilently();
      if (!token) {
        throw new Error('Could not get access token');
      }

      const userResponse = await fetch(`https://${auth0Domain}/api/v2/users/${encodeURIComponent(user.sub)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      let currentMetadata: UserMetadata = {};
      if (userResponse.ok) {
        const userData = await userResponse.json();
        currentMetadata = userData.user_metadata || {};
      }

      const newMetadata: UserMetadata = {
        mazesSolved: (currentMetadata.mazesSolved || 0) + 1,
        solveHistory: [
          ...(currentMetadata.solveHistory || []),
          solveData
        ]
      };

      // Update with merged metadata
      const response = await fetch(`https://${auth0Domain}/api/v2/users/${encodeURIComponent(user.sub)}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_metadata: newMetadata
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        throw new Error(errorData.message || 'Failed to update user stats');
      }

      const updatedStats = await response.json();
      setUserStats(updatedStats.user_metadata);

    } catch (error) {
      console.error('Error updating user stats:', error);
      setState(prev => ({ ...prev, status: 'Error updating stats' }));
    }
};

  useEffect(() => {
    console.log("Auth status:", { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const handleSolveMaze = async () => {
    if (state.solving || !maze.length) return;
    
    setState(prev => ({ ...prev, solving: true, status: 'Solving maze...' }));
    const startTime = Date.now();
    
    try {
      setVisited(new Set());
      setCurrentPath([]);
      
      let solved = false;
      if (state.algorithm === 'dfs') {
        solved = await dfs(1, 1, new Set(), []);
      } else {
        const path = await bfs();
        solved = path !== null;
      }
      
      if (solved) {
        const solveTime = (Date.now() - startTime) / 1000;
        setState(prev => ({ ...prev, status: `Maze solved in ${solveTime.toFixed(2)}s!` }));
        
        const solveData = {
          date: new Date().toISOString(),
          algorithm: state.algorithm,
          timeToSolve: solveTime,
          mazeSize: { rows: state.rows, cols: state.cols }
        };

        await updateUserStats(solveData);
      } else {
        setState(prev => ({ ...prev, status: 'No solution found!' }));
      }
    } catch (error) {
      console.error('Error solving maze:', error);
      setState(prev => ({ ...prev, status: 'Error solving maze' }));
    }
    
    setState(prev => ({ ...prev, solving: false }));
  };
  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <View style={styles.controlsTop}>
          <TouchableOpacity
            onPress={() => setState(prev => ({ ...prev, showSettings: !prev.showSettings }))}
            style={styles.settingsButton}
          >
            <Ionicons name={state.showSettings ? "chevron-down" : "chevron-forward"} size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.algorithmButton}
            onPress={() => setState(prev => ({ 
              ...prev, 
              algorithm: prev.algorithm === 'dfs' ? 'bfs' : 'dfs' 
            }))}
          >
            <Text style={styles.buttonText}>{state.algorithm.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlsBottom}>
          <TouchableOpacity
            onPress={handleGenerateNewMaze}
            disabled={state.solving}
            style={[styles.button, styles.generateButton]}
          >
            <Text style={styles.buttonText}>New</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSolveMaze}
            disabled={state.solving}
            style={[styles.button, styles.solveButton]}
          >
            <Text style={styles.buttonText}>Solve</Text>
          </TouchableOpacity>
        </View>
      </View>
  
      {state.showSettings && (
        <View style={styles.settings}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Rows:</Text>
            <TextInput
              style={styles.input}
              value={state.rows.toString()}
              onChangeText={(text) => setState(prev => ({ ...prev, rows: parseInt(text) || 5 }))}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Columns:</Text>
            <TextInput
              style={styles.input}
              value={state.cols.toString()}
              onChangeText={(text) => setState(prev => ({ ...prev, cols: parseInt(text) || 5 }))}
              keyboardType="number-pad"
            />
          </View>
        </View>
      )}
  
      <Text style={styles.algorithmDescription}>
        {algorithmDescriptions[state.algorithm]}
      </Text>
  
      {state.status && (
        <Text style={[styles.status, 
          state.status.includes('error') ? styles.errorStatus :
          state.status.includes('solved') ? styles.successStatus :
          styles.infoStatus
        ]}>
          {state.status}
        </Text>
      )}

      {userStats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Mazes Solved</Text>
              <Text style={styles.statValue}>{userStats.mazesSolved}</Text>
            </View>
            {userStats.solveHistory.length > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Best Time</Text>
                <Text style={styles.statValue}>
                  {Math.min(...userStats.solveHistory.map(h => h.timeToSolve)).toFixed(2)}s
                </Text>
              </View>
            )}
          </View>

          {userStats.solveHistory.length > 0 && (
            <View style={styles.recentSolves}>
              <Text style={styles.recentTitle}>Recent Solves</Text>
              {userStats.solveHistory.slice(-5).reverse().map((solve, index) => (
                <View key={index} style={styles.solveItem}>
                  <Text style={styles.solveAlgo}>{solve.algorithm.toUpperCase()}</Text>
                  <Text style={styles.solveTime}>{solve.timeToSolve.toFixed(2)}s</Text>
                  <Text style={styles.solveSize}>
                    {solve.mazeSize.rows}x{solve.mazeSize.cols}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
  
      <ScrollView 
        horizontal 
        contentContainerStyle={styles.mazeContainer}
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView 
          contentContainerStyle={styles.mazeInnerContainer}
          showsVerticalScrollIndicator={false}
        >
          <MazeRenderer />
        </ScrollView>
      </ScrollView>
    </View>
  );

  

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
    padding: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  controlsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#622eab',
  },
  generateButton: {
    backgroundColor: '#622eab',
  },
  solveButton: {
    backgroundColor: '#7b42d1',
  },
  settingsButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  algorithmButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
    controlsTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  controlsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  settings: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    color: '#fff',
    width: 80,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 8,
    borderRadius: 4,
    width: 60,
  },
  algorithmDescription: {
    color: '#888',
    marginBottom: 16,
  },
  status: {
    textAlign: 'center',
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  errorStatus: {
    backgroundColor: '#ff000033',
    color: '#ff6666',
  },
  successStatus: {
    backgroundColor: '#00ff0033',
    color: '#66ff66',
  },
  infoStatus: {
    backgroundColor: '#0000ff33',
    color: '#6666ff',
  },
  mazeContainer: {
    padding: 16,
  },
  mazeInnerContainer: {
    backgroundColor: '#222',
    padding: 8,
    borderRadius: 8,
  },  statsContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  statLabel: {
    color: '#888',
    fontSize: 14,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  recentSolves: {
    gap: 8,
  },
  recentTitle: {
    color: '#888',
    fontSize: 16,
    marginBottom: 8,
  },
  solveItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  solveAlgo: {
    color: '#fff',
    fontWeight: '500',
  },
  solveTime: {
    color: '#7b42d1',
    fontWeight: 'bold',
  },
  solveSize: {
    color: '#888',
  },
});
