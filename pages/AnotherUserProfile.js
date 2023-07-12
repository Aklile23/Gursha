// Imports
import axios from 'axios';
import {SERVER_API} from '@env';
import {db} from '../src/firebase';
import Chat from '../components/Chat';
import {Button} from 'react-native-paper';
import {AuthContext} from '../context/Auth';
import {AntDesign} from '@expo/vector-icons';
import Following from '../components/Following';
import Followers from '../components/Followers';
import {useContext, useEffect, useState} from 'react';
import VideosProfilePreview from '../components/VideosProfilePreview';
import {getDoc, setDoc, doc, updateDoc, serverTimestamp} from 'firebase/firestore';
import {Text, Modal, View, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity} from 'react-native';





// Main function
const AnotherUserProfile = ({isUserModalOpened, setIsUserModalOpened, user, theme, isFollowIconVisible, setIsFollowIconVisible, isFollowed}) => {



    // User
    const {user:registeredUser, update} = useContext(AuthContext);
    const [isFollowingOpened, setIsFollowingOpened] = useState(false);
    const [isFollowersOpened, setIsFollowersOpened] = useState(false);



    // User's posts
    const [posts, setPosts] = useState([]);
    const postsFetcher = async () => {
        try {
            const link = `${SERVER_API}/posts/${user?._id}`;
            const res = await axios.get(link);
            setPosts(res.data);
        } catch (err) {
            console.log(err);
        }
    };



    // Follow handler
    const [followersCount, setFollowersCount] = useState(user.followersCount);
    const followHandler = async () => {
        try {
            setIsFollowIconVisible(!isFollowIconVisible);
            const link = `${SERVER_API}/users/follow/${user._id}`
            const res = await axios.put(link, {followerId:registeredUser?._id});
            setFollowersCount(res.data === 'User followed' ? followersCount + 1 : followersCount - 1);
            update({newFollowing:user._id, bio:registeredUser.bio, profilePic:registeredUser.profilePic, isFollow:res.data === 'User followed' ? true : false});
        } catch (err) {
            console.log(err);
        }
    };



    // Opening chat
    const [isChatOpened, setIsChatOpened] = useState(false);
    const chat = async () => {
        try {
            const combinedId = registeredUser?._id > user?._id ? registeredUser?._id + user?._id : user?._id + registeredUser?._id;
            const res = await getDoc(doc(db, 'chats', combinedId));
            if(!res.exists()){
                setDoc(doc(db, 'chats', combinedId), {messages:[]}).then(() => {
                    updateDoc(doc(db, 'userChats', registeredUser?._id), {
                        [combinedId+'.userInfo']:{
                            id:user?._id,
                            username:user.username
                        },
                        [combinedId+'.date']:serverTimestamp()
                    });
                    updateDoc(doc(db, 'userChats', user?._id), {
                        [combinedId+'.userInfo']:{
                            id:registeredUser?._id,
                            username:registeredUser.username
                        },
                        [combinedId+'.date']:serverTimestamp()
                    });
                });
            };
            setIsChatOpened(true);
        } catch (err) {
            console.log(err);
        };
    };



    // Use effect
    useEffect(() => {
        postsFetcher();
        setFollowersCount(user.followersCount);
        setIsFollowIconVisible(registeredUser?.following?.includes(user?._id) ? false : true);
    }, [isUserModalOpened]);



    return (
        user &&
        <Modal visible={isUserModalOpened}>
            <Chat
                isChatOpened={isChatOpened}
                setIsChatOpened={setIsChatOpened}
                theme={theme}
                searchedUser={user}
                isProfile={true}
            />
            <Following
              isFollowingOpened={isFollowingOpened}
              setIsFollowingOpened={setIsFollowingOpened}
              userId={user?._id}
              theme={theme}
            />
            <Followers
              isFollowersOpened={isFollowersOpened}
              setIsFollowersOpened={setIsFollowersOpened}
              userId={user?._id}
              theme={theme}
            />
            <View style={styles.container}>
                <TouchableOpacity onPress={() => setIsUserModalOpened(false)} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={30} color="#fff" />
                </TouchableOpacity>
                <ScrollView>
                    <View style={styles.bioContainer}>
                        <Text style={styles.bio}>{user.bio}</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        {user?.profilePic ? (
                            <Image
                                source={{uri:user.profilePic}}
                                style={styles.image}
                            />
                        ) : (
                            <View
                                style={[styles.image, {backgroundColor:'#fff'}]}
                            />
                        )}
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
                            <Text style={styles.number}>{followersCount}</Text>
                            <Text style={styles.category}>Followers</Text>
                        </TouchableOpacity>
                    </View>
                    {registeredUser && (
                        <View style={styles.buttonsContainer}>
                            <Button style={styles.buttonContainer} onPress={followHandler}>
                                <Text style={[styles.button, {color:theme.colors.primary}]}>
                                    {isFollowed ? 'Unfollow' : isFollowIconVisible ? 'Follow' : 'Unfollow'}
                                </Text>
                            </Button>
                            <Button style={styles.buttonContainer} onPress={chat}>
                                <Text style={[styles.button, {color:theme.colors.primary}]}>
                                    Chat
                                </Text>
                            </Button>
                        </View>
                    )}
                    <Text style={styles.hr}>-</Text>
                    <View>
                        <VideosProfilePreview
                            posts={posts}
                            theme={theme}
                        />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};





const styles = StyleSheet.create({
    container:{
        backgroundColor:'#000',
        height:Dimensions.get('screen').height
    },
    backButton:{
        zIndex:1,
        width:'100%',
        paddingLeft:10,
        paddingVertical:5,
        borderColor:'#ccc',
        position:'absolute',
        borderBottomWidth:0.5,
        backgroundColor:'#000'
    },
    bioContainer:{
        width:'100%',
        marginTop:50
    },
    bio:{
        color:'#fff',
        paddingTop:20,
        textAlign:'center'
    },
    imageContainer:{
        width:'100%',
        marginTop:30,
        display:'flex',
        alignItems:'center'
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
        paddingHorizontal:100,
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
    buttonsContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonContainer:{
        marginTop:20
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
    }
});





// Export
export default AnotherUserProfile;