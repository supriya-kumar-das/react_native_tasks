import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {error} from './constants/errorMessage';
import {useIsFocused} from '@react-navigation/native';
import Task from './components/task';
import CompletedTask from './components/completedTask';

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isError, setisError] = useState(false);
  const [status, setStatus] = useState('Pending');

  const height = Dimensions.get('window').height;
  const focus = useIsFocused();
  useEffect(() => {
    loadTasks();
  }, [focus]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to AsyncStorage:', error);
    }
  };

  const addTask = () => {
    if (title.trim() === '') {
      setisError(true);
      return;
    }

    const newTask = {
      id: Math.random().toString(),
      title,
      description,
      completed: false,
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setModalVisible(false);
    setTitle('');
    setDescription('');
    setisError(false);
  };

  const toggleTaskCompletion = taskId => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? {...task, completed: !task.completed} : task,
      ),
    );
  };

  const deleteTask = taskId => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  return (
    <View
      style={[
        {
          height: height,
        },
        styles.container,
      ]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Task List</Text>
      </View>
      {tasks.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noText}>No task found.</Text>
        </View>
      ) : (
        <View style={styles.tab}>
          <TouchableOpacity
            style={[
              styles.box,
              {backgroundColor: status === 'Pending' ? 'blue' : '#fff'},
            ]}
            onPress={() => setStatus('Pending')}>
            <Text
              style={[
                {color: status === 'Pending' ? '#fff' : '#000'},
                styles.font,
              ]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.box,
              {backgroundColor: status === 'Pending' ? '#fff' : 'blue'},
            ]}
            onPress={() => setStatus('Completed')}>
            <Text
              style={[
                {color: status === 'Pending' ? '#000' : '#fff'},
                styles.font,
              ]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={
          status === 'Pending'
            ? tasks.filter(x => x?.completed === false)
            : tasks.filter(x => x?.completed === true)
        }
        keyExtractor={item => item.id}
        renderItem={({item}) =>
          status === 'Pending' ? (
            <Task
              data={item}
              completeHandler={() => {
                toggleTaskCompletion(item.id);
              }}
              deleteHandler={() => {
                deleteTask(item.id);
              }}
            />
          ) : (
            <CompletedTask
              data={item}
              deleteHandler={() => {
                deleteTask(item.id);
              }}
            />
          )
        }
      />
      {status === 'Pending' &&
      tasks.filter(x => x?.completed === false).length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noText}>No pending task found.</Text>
        </View>
      ) : null}
      {status === 'Completed' &&
      tasks.filter(x => x?.completed === true).length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noText}>No completed task found.</Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Image
          source={require('./assets/images/add.png')}
          style={styles.img}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* add todo */}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              placeholderTextColor={'#000'}
              value={title}
              onChangeText={setTitle}
            />
            {title.trim() === '' && isError ? (
              <Text style={styles.error}>{error.title}</Text>
            ) : null}
            <TextInput
              style={styles.inputArea}
              multiline
              placeholder="Task Description"
              placeholderTextColor={'#000'}
              value={description}
              onChangeText={setDescription}
            />

            <View style={{marginBottom: 10}}>
              <Button title="Save Task" onPress={addTask} />
            </View>
            <View style={{marginBottom: 10}}>
              <Button
                color={'red'}
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  addButton: {
    position: 'absolute',
    height: 60,
    width: 60,
    bottom: 10,
    right: 10,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  inputArea: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  taskTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    color: 'red',
  },
  error: {color: 'red', paddingBottom: 5, marginTop: -5, fontSize: 12},
  box: {
    width: '50%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'blue',
    borderWidth: 1,
  },
  font: {fontSize: 16, fontWeight: '600'},
  header: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  headerText: {fontSize: 20, fontWeight: '600', color: 'blue'},
  noText: {fontSize: 16, fontWeight: '600', color: 'red'},
  tab: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5,
    paddingHorizontal: 1,
  },
});
