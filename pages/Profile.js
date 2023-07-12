// Imports
import axios from 'axios';
import {SERVER_API} from '@env';
import {auth} from '../src/firebase';
import {signOut} from 'firebase/auth';
import {Link} from 'react-router-native';
import {Button} from 'react-native-paper';
import {AuthContext} from '../context/Auth';
import Following from '../components/Following';
import Followers from '../components/Followers';
import {useContext, useEffect, useState} from 'react';
import VideosProfilePreview from '../components/VideosProfilePreview';
import {StyleSheet, Text, View, ScrollView, Dimensions, Image, TouchableOpacity} from 'react-native';





// Main Function
const Profile = ({theme}) => {



  // User
  const {user, logout} = useContext(AuthContext);
  const [isCommentPosted, setIsCommentPosted] = useState(false);



  // Following and followers pages
  const [isFollowingOpened, setIsFollowingOpened] = useState(false);
  const [isFollowersOpened, setIsFollowersOpened] = useState(false);
  const [likesCount, setLikesCount] = useState();



  // Logout
  const signOutHandler = () => {
    signOut(auth).catch(e => console.log(e));
  };



  // Posts fetcher
  const [posts, setPosts] = useState([]);
  const postsFetcher = async () => {
    try {
      const link = `${SERVER_API}/posts/${user?._id}`;
      const res = await axios.get(link);
      setPosts(res.data);
      let likes = [];
      res.data.forEach(post => likes.push(post.likesCount));
      const sum = likes.reduce((accumulator, value) => accumulator + value, 0);
      setLikesCount(sum);
    } catch (err) {
      console.log(err);
    }
  };



  // Use effect
  useEffect(() => {
    postsFetcher();
  }, []);
  useEffect(() => {
    postsFetcher();
  }, [isCommentPosted]);



  return (
    <ScrollView style={styles.container}>
      {
        user?.username?
        (
          <>
            <View style={styles.bioContainer}>
              <Text style={styles.bio}>{user.bio}</Text>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => {
                signOutHandler();
                logout();
              }}>
                <Text style={{color:theme.colors.primary}}>Logout</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{uri:user.profilePic}}
                  style={styles.image}
                />
              </View>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{user.username}</Text>
            </View>
            <View style={styles.bar}>
              <TouchableOpacity style={styles.item} onPress={() => setIsFollowingOpened(true)}>
                <Text style={styles.number}>{user.followingCount}</Text>
                <Text style={styles.category}>Following</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.item} onPress={() => setIsFollowersOpened(true)}>
                <Text style={styles.number}>{user.followersCount}</Text>
                <Text style={styles.category}>Followers</Text>
              </TouchableOpacity>
              <View style={styles.item}>
                <Text style={styles.number}>{likesCount}</Text>
                <Text style={styles.category}>Likes</Text>
              </View>
            </View>
            <Link to='/edit'>
              <Button style={styles.buttonContainer}>
                <Text style={[styles.button, {color:theme.colors.primary}]}>
                  Edit profile
                </Text>
              </Button>
            </Link>
            <Text style={styles.hr}>-</Text>
            <VideosProfilePreview
              posts={posts}
              theme={theme}
              isCommentPosted={isCommentPosted}
              setIsCommentPosted={setIsCommentPosted}
            />
            <Following
              isFollowingOpened={isFollowingOpened}
              setIsFollowingOpened={setIsFollowingOpened}
              userId={user._id}
              theme={theme}
            />
            <Followers
              isFollowersOpened={isFollowersOpened}
              setIsFollowersOpened={setIsFollowersOpened}
              userId={user._id}
              theme={theme}
            />
          </>
        ) :
        (
          <View style={styles.authenticatedContainer}>
            <Link to='/register'>
              <Text style={{marginBottom:15, marginTop:30, color:theme.colors.primary}}>Register</Text>
            </Link>
            <Link to='/login'>
              <Text style={{color:theme.colors.primary}}>Login</Text>
            </Link>
          </View>
        )
      }
    </ScrollView>
  );
};





// Styles
const styles = StyleSheet.create({
  container:{
    backgroundColor:'#000',
    height:Dimensions.get('screen').height
  },
  bioContainer:{
    width:'100%',
  },
  bio:{
    color:'#fff',
    paddingTop:20,
    textAlign:'center',
  },
  actionsContainer:{
    top:20,
    right:30,
    position:'absolute'
  },
  authenticatedContainer:{
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    height:Dimensions.get('screen').height
  },
  imageContainer:{
    width:'100%',
    marginTop:30,
    display:'flex',
    alignItems:'center'
  },
  imageWrapper:{
    width:100,
    height:100,
    borderRadius:200,
    backgroundColor:'#fff'
  },
  image:{
    width:100,
    height:100,
    borderRadius:50
  },
  nameContainer:{
    width :'100%'
  },
  name:{
    marginTop:10,
    color:'#fff',
    textAlign:'center',
  },
  bar:{
    width:'100%',
    marginTop:30,
    display:'flex',
    flexDirection:'row',
    paddingHorizontal:50,
    justifyContent:'space-between'
  },
  item:{
    display:'flex',
    alignItems:'center'
  },
  number:{
    color:'#fff'
  },
  category:{
    fontSize:12,
    color:'#ccc'
  },
  buttonContainer:{
    paddingTop:20
  },
  button:{
    fontSize:18,
    paddingTop:40,
    fontWeight:300
  },
  hr:{
    fontSize:1,
    width:'100%',
    marginTop:20,
    borderColor:'#ccc',
    borderBottomWidth:1
  },
  gridView: {
    flex:1,
    paddingBottom:55
  },
  itemContainer: {
    padding:10,
    height:220,
    borderWidth:0.2,
    borderColor:'#ccc',
    justifyContent:'flex-end'
  },
  itemName: {
    fontSize:14,
    color:'#fff'
  }
});





// Export
export default Profile;