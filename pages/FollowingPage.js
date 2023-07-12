// Imports
import axios from 'axios';
import {SERVER_API} from '@env';
import Post from '../components/Post';
import {Link} from 'react-router-native';
import {Entypo} from '@expo/vector-icons';
import {AuthContext} from '../context/Auth';
import PagerView from 'react-native-pager-view';
import {ActivityIndicator} from 'react-native-paper';
import {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';





// Main Function
const FollowingPage = ({theme}) => {



  // User
  const {user:registeredUser} = useContext(AuthContext);



  // Video
  const [playingVideoId, setPlayingVideoId] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);



  // Fetching posts
  const [posts, setPosts] = useState([{}]);
  const postsFetcher = async e => {
    try {
      const link = `${SERVER_API}/posts/following/${registeredUser?._id}`;
      const res = await axios.get(link);
      setPosts(res.data.sort(
        (a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    ));
      setPlayingVideoId(res.data[0]?._id);
    } catch (err) {
      console.log(err);
    }
  };



  // Video switcher
  const videoSwitcher = e => {
    setPlayingVideoId(posts[e.nativeEvent.position]?._id);
    setIsVideoPlaying(true);
  };



  // Comment check
  const [isCommentPosted, setIsCommentPosted] = useState(false);



  // Use effect
  useEffect(() => {
    postsFetcher();
  }, [isCommentPosted]);



  return (
    registeredUser ? (
      posts[0]?._id ? (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <View style={styles.pages}>
                  <TouchableOpacity onPress={() => setIsVideoPlaying(true)}>
                    <Text style={styles.selectedPage}>Following</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsVideoPlaying(true)}>
                    <Link to='/' underlayColor='transparent'>
                      <Text style={styles.page}>For You</Text>
                    </Link>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.searchIcon}
                  >
                    <Entypo name="magnifying-glass" size={30} color="#fff" />
                  </TouchableOpacity>
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
                          fromFollowing={true}
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
    ) : (
      <View style={styles.authenticatedContainer}>
        <Text style={{color:'#fff'}}>Login to see your friends videos..</Text>
        <Link to='/register'>
          <Text style={{marginBottom:15, marginTop:30, color:theme.colors.primary}}>Register</Text>
        </Link>
        <Link to='/login'>
          <Text style={{color:theme.colors.primary}}>Login</Text>
        </Link>
      </View>
    )
  );
};






// Styles
const styles = StyleSheet.create({
  container:{
    backgroundColor:'#000',
    height:Dimensions.get('screen').height - 100
  },
  authenticatedContainer:{
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    height:Dimensions.get('screen').height
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
    color:'#fff'
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
export default FollowingPage;