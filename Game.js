import { StatusBar } from 'expo-status-bar';
import React, {PureComponent} from 'react';
import { StyleSheet, Text, View, Dimensions, Alert, Button} from 'react-native';
import { GameEngine } from "react-native-game-engine";
import { Item, Bin, Timer } from "./renderers";
import { MoveItem, Collision } from "./systems";
//import Constants from './Constants';
const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;


export default class Game extends React.Component  {
  constructor() {
    super();
    this.engine = null;

    this.state ={
      running: true,
      points: 0,
      timer: 1,
      item: "can" //random
    }
  }

  onEvent = (e) => {
    if (e.type=='game-over') {
      this.setState({
        running: false
      });
    }
 
    if (e.type == 'correct') {
      this.setState({
        points: this.state.points+10
      })
    }
    if (e.type=='wrong') {
      this.setState({
        points: this.state.points-10
      });
    }
  }

  onChangeTimer = () => {   
    this.setState({ running: false });
  }

  reset = () => {
    this.setState({
        running: true,
        points: 0,
        timer: 1
    });
}
//
   /* componentDidMount() {
        if (this.props.route.params.startAgain==true)
        this.reset();
    }*/
  
  render() {
      //if (this.state.running==false)
        //this.props.navigation.navigate("GameOver", {points: this.state.points});
   // if (!this.state.running && this.props.route.params.startAgain===true)
     //   this.reset;
  return (
    <View style={styles.container}>
      <Text style={styles.points}>POINTS: {this.state.points}</Text>
      <Timer min={this.state.timer} onChange={this.onChangeTimer}/>
      <GameEngine
      ref={(ref) => { this.engine = ref; }}
        style={styles.container}
        running = {this.state.running}
        onEvent = {this.onEvent}
        systems={[MoveItem, Collision]}
        entities={{
          1: { position: [WIDTH/2, HEIGHT-100], item: this.state.item, renderer: <Item/>}, //-- Notice that each entity has a unique id (required)
          2: {position: [WIDTH - 40, HEIGHT/2], category: "paper", renderer: <Bin/>},
          3: {position: [WIDTH - 40, HEIGHT/4], category: "glass", renderer: <Bin/>},
          4: {position: [WIDTH/8, HEIGHT/2], category: "organic",renderer: <Bin/>},
          5: {position: [WIDTH/8, HEIGHT/4], category: "plastic", renderer: <Bin/>},
          6: {position: [WIDTH/2, HEIGHT/6], category: "trash", renderer: <Bin/>},

        }}>
      <StatusBar hidden={true} />
      </GameEngine>
      {!this.state.running && 
      Alert.alert(
          'Game over! Your score: '+this.state.points,
          '',
          [
              {
                  text: 'Play again',
                  onPress: () => this.reset()
              },
              {
                  text: 'View Scoreboard',
                  onPress: () => this.props.navigation.navigate("GameOver", {points: this.state.points})
              }
          ]
      )} 
      <StatusBar style="auto" />
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  points: {
    color: 'red'
  }
  
});