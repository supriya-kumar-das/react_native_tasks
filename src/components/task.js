import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React,{useState} from 'react';


const Task = ({data, deleteHandler,completeHandler}) => {
    const [isCheck, setIsCheck] = useState(false)

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{data?.title}</Text>
      </View>
      <View style={styles.descriptionBox}>
        <Text style={styles.description}>{data?.description}</Text>
      </View>
      <TouchableOpacity onPress={deleteHandler} style={styles.delete}>
        <Image
          source={require('../assets/images/delete.png')}
          style={styles.img}
        />
      </TouchableOpacity>
      <TouchableOpacity 
      onPress={()=>{
        setIsCheck(!isCheck);
        completeHandler();
      }} 
      style={styles.CheckBox}
      >
    <View style={[styles.CheckBoxInner,{backgroundColor:isCheck?"green":"#fff"}]}>
        {
          isCheck ?  
          <Image
          source={require('../assets/images/tick.png')}
          style={{width:"100%",height:"100%"}}
          resizeMode='contain'
          tintColor={"#fff"}

        />:null
        }
         
    </View>         
      </TouchableOpacity>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    padding: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderradius: 5,
    shadowColor: '#000',
    paddingLeft: 25,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
    borderTopWidth:0.3,
    borderColor:"grey"
  },
  title: {color: '#000', fontSize: 16, fontWeight: '600'},
  description: {color: 'grey', fontSize: 14},
  titleBox: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  descriptionBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft:3
  },
  delete: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  CheckBox: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  CheckBoxInner:{
    height:15,
    width:15,
    borderWidth:1,
    borderColor:"#000",
},
  img: {height: 15, width: 15},
});
