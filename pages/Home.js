// Imports
import Post from '../components/Post';
import {Link} from 'react-router-native';
import {Entypo} from '@expo/vector-icons';
import {useContext, useState} from 'react';
import {AuthContext} from '../context/Auth';
import PagerView from 'react-native-pager-view';
import {ActivityIndicator} from 'react-native-paper';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';





// Main Function
const Home = ({theme, posts, isCommentPosted, setIsCommentPosted, playingVideoId, setPlayingVideoId}) => {



  // Video
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);



  // Video switcher
  const videoSwitcher = e => {
    setPlayingVideoId(posts[e.nativeEvent.position]?._id);
    setIsVideoPlaying(true);
  };


  
  return (
      posts[0]?._id ? (
        <View style={styles.container}>
          <View style={styles.topbar}>
            <View style={styles.pages}>
              <TouchableOpacity onPress={() => setIsVideoPlaying(true)}>
                <Link to='/following' underlayColor='transparent'>
                  <Text style={styles.page}>Following</Text>
                </Link>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsVideoPlaying(true)}>
                <Text style={styles.selectedPage}>For You</Text>
              </TouchableOpacity>
              <Link style={styles.searchIcon} to='/search' underlayColor='transparent'>
                <Entypo name="magnifying-glass" size={30} color="#fff" />
              </Link>
            </View>
            </View>
            <PagerView
              style={styles.pagerView}
              scrollEnabled
              orientation='vertical'
              onPageSelected={e => {
                videoSwitcher(e);
              }}
            >
              {posts?.map(post => (
                <>
                  <Post
                      post={post}
                      isVideoPlaying={isVideoPlaying}
                      playingVideoId={playingVideoId}
                      setIsVideoPlaying={setIsVideoPlaying}
                      theme={theme}
                      setIsCommentPosted={setIsCommentPosted}
                      isCommentPosted={isCommentPosted}
                    />
                </>
              ))}
            </PagerView>
          </View>
        ) : (
          <View style={styles.progressContainer}>
            <ActivityIndicator animating={true} color='#fff' size={50}/>
          </View>
        )
    )
};






// Styles
const styles = StyleSheet.create({
  container:{
    backgroundColor:'#000',
    height:Dimensions.get('screen').height - 100
  },
  pagerView:{
    flex:1
  },
  progressContainer:{
    height:'100%',
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  topbar:{
    top:0,
    zIndex:2,
    width:'100%',
    display:'flex',
    alignItems:'center',
    position:'absolute',
    justifyContent:'center'
  },
  pages:{
    width:'50%',
    display:'flex',
    paddingTop:'10%',
    flexDirection:'row',
    position:'relative',
    justifyContent:'space-between'
  },
  page:{
    color:'#ccc'
  },
  selectedPage:{
    color:'#fff',
    textDecorationLine:'underline'
  },
  searchIcon:{
    top:40,
    right:-90,
    position:'absolute'
  },
});






// Export
export default Home;