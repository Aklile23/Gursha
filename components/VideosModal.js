// Imports
import Post from './Post';
import {useState} from 'react';
import {AntDesign} from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';
import {Modal, View, StyleSheet, Dimensions, Text, TouchableOpacity} from 'react-native';





// Main function
const VideosModal = ({posts, theme, isVideosModalOpened, setIsVideosModalOpened, isCommentPosted, setIsCommentPosted}) => {



  // Video
  const [playingVideoId, setPlayingVideoId] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoSwitcher = e => {
    setPlayingVideoId(posts[e.nativeEvent.position]._id);
    setIsVideoPlaying(true);
  };



  return (
    <Modal visible={isVideosModalOpened}>
        <View style={styles.container}>
            <View style={styles.backButton}>
                <TouchableOpacity
                    onPress={() => setIsVideosModalOpened(false)} 
                >
                    <AntDesign name="arrowleft" size={30} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.username}>{posts[0]?.username}</Text>
            </View>
            <PagerView
                style={styles.pagerView}
                scrollEnabled
                orientation='vertical'
                onPageSelected={e => {
                    videoSwitcher(e);
                }}
            >
                {posts.map(post => (
                    <>
                        <Post
                            post={post}
                            isVideoPlaying={isVideoPlaying}
                            playingVideoId={playingVideoId}
                            setIsVideoPlaying={setIsVideoPlaying}
                            theme={theme}
                            setIsCommentPosted={setIsCommentPosted}
                            isCommentPosted={isCommentPosted}
                            fromProfile={true}
                        />
                    </>
                ))}
            </PagerView>
          </View>
    </Modal>
  );
};





// Styles
const styles = StyleSheet.create({
    container:{
      paddingBottom:50,
        backgroundColor:'#000',
        height:Dimensions.get('screen').height
    },
    pagerView:{
        flex:1
    },
    backButton:{
      zIndex:1,
      width:'100%',
      display:'flex',
      paddingLeft:10,
      paddingVertical:5,
      borderColor:'#ccc',
      flexDirection:'row',
      alignItems:'center',
      position:'absolute',
      borderBottomWidth:0.5,
      backgroundColor:'#000'
    },
    username:{
      color:'#fff',
      width:'100%',
      paddingRight:50,
      textAlign:'center'
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
        color:'#fff'
    },
    searchIcon:{
        top:32,
        right:-100,
        position:'absolute'
    },
});





// Export
export default VideosModal;