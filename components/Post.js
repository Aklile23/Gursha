// Imports
import axios from 'axios';
import {Video} from 'expo-av';
import {SERVER_API} from '@env';
import Comments from './Comments';
import {Avatar} from 'react-native-paper';
import {AuthContext} from '../context/Auth';
import {AntDesign} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import AnotherUserProfile from '../pages/AnotherUserProfile';
import {useRef, useState, useContext, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';





// Main function
const Post = ({post, playingVideoId, isVideoPlaying, setIsVideoPlaying, theme, setIsCommentPosted, isCommentPosted, fromProfile, fromFollowing}) => {



    // Post user
    const [postUser, setPostUser] = useState({});



    // Video
    const videoRef = useRef(null);
    const {user, update} = useContext(AuthContext);



    // Modals
    const [isUserModalOpened, setIsUserModalOpened] = useState(false);
    const [isCommentOpened, setIsCommentsOpened] = useState(false);



    // Liking post
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [isLiked, setIsLiked] = useState(false);
    const likeHandler = async () => {
        try {
            if(user){
                const link = `${SERVER_API}/posts/like/${post?._id}`;
                const res = await axios.put(link, {userId:user?._id});
                setLikesCount(res.data === 'Post liked.' ? likesCount + 1 : likesCount - 1);
                setIsLiked(!isLiked);
            }else{
                console.log('No user assigned');
            }
        } catch (err) {
            console.log(err);
        }
    };



    // Follow handler
    const [isFollowIconVisible, setIsFollowIconVisible] = useState(true);
    const followHandler = async id => {
        try {
            const link = `${SERVER_API}/users/follow/${id}`
            const res = await axios.put(link, {followerId:user?._id});
            setIsFollowIconVisible(false);
            update({newFollowing:id, bio:user.bio, profilePic:user.profilePic, isFollow:res.data === 'User followed' ? true : false});
        } catch (err) {
            console.log(err);
        }
    };



    // Use effect
    useEffect(() => {
        setLikesCount(post.likesCount);
        post?.likes?.map(like => like.id === user?._id ? setIsLiked(true) : setIsLiked(false));
        const fetchUser = async () => {
            try {
                const link = `${SERVER_API}/users/${post.username}`;
                const res = await axios.get(link);
                setPostUser(res.data);
            } catch (err) {
                console.log(err.response.data);
            }
        };
        fetchUser();
    }, [post]);
    useEffect(() => {
        setIsCommentsOpened(false);
    }, [playingVideoId]);
    useEffect(() => {
        isUserModalOpened && setIsVideoPlaying(false);
    }, [isUserModalOpened]);
    useEffect(() => {
        setIsFollowIconVisible(user?.following?.includes(postUser?._id) ? false : true);
    }, [postUser]);



    return (
        <>
            <View>
                <AnotherUserProfile
                    isUserModalOpened={isUserModalOpened}
                    setIsUserModalOpened={setIsUserModalOpened}
                    user={postUser}
                    theme={theme}
                    isFollowIconVisible={isFollowIconVisible}
                    setIsFollowIconVisible={setIsFollowIconVisible}
                />
                <Pressable style={styles.post} onPress={() => {
                    setIsVideoPlaying(!isVideoPlaying);
                    setIsCommentsOpened(false);
                }}>
                    <View style={styles.videoContainer}>
                        <Video
                            ref={videoRef}
                            source={{uri:post.video}}
                            resizeMode='contain'
                            isLooping
                            shouldPlay={playingVideoId === post?._id ? isVideoPlaying : false}
                            style={styles.video}
                        />
                    </View>
                    <View style={styles.content}>
                        <View style={styles.textsContainer}>
                            <View style={styles.texts}>
                                <View style={styles.textsContent}>
                                    {!fromProfile && (
                                        <Text style={styles.username}>{post.username}</Text>
                                    )}
                                    <Text style={styles.description}>{post.body}</Text>
                                </View>
                            </View>
                            <View style={styles.interactions}>
                                {!fromProfile && (
                                    <View style={styles.userProfile}>
                                        {postUser?.profilePic ? (
                                            <TouchableOpacity onPress={() => setIsUserModalOpened(true)}>
                                                <Avatar.Image source={{uri:postUser?.profilePic}}/>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() => setIsUserModalOpened(true)}>
                                                <View style={styles.noBackground}/>
                                            </TouchableOpacity>
                                        )}
                                        {user && post.user !== user?._id && isFollowIconVisible && !fromFollowing && (
                                            <TouchableOpacity onPress={() => followHandler(post.user)} style={[styles.followButtonContainer, {backgroundColor:theme.colors.primary}]}>
                                                <AntDesign name="plus" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                                <View style={styles.itemContainer}>
                                    {user &&
                                        <>
                                            <TouchableOpacity onPress={likeHandler}>
                                                <AntDesign name="heart" size={40} color={user ? isLiked ? '#f00' : '#fff' : '#ffffff80'} />
                                            </TouchableOpacity>
                                            <Text style={styles.number}>{likesCount}</Text>
                                        </>
                                    }
                                </View>
                                <View style={[styles.itemContainer, {marginTop:10}]}>
                                    <TouchableOpacity onPress={() => setIsCommentsOpened(true)}>
                                        <MaterialIcons name="comment" size={40} color="#fff" />
                                    </TouchableOpacity>
                                    <Text style={styles.number}>{post.commentsCount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Pressable>
            </View>
            <Comments
                isCommentsOpened={isCommentOpened}
                setIsCommentsOpened={setIsCommentsOpened}
                post={post}
                theme={theme}
                setIsCommentPosted={setIsCommentPosted}
                isCommentPosted={isCommentPosted}
            />
        </>
    );
};






// Styles
const styles = StyleSheet.create({
    post:{
        height:'100%'
    },
    videoContainer:{
        width:'100%',
        height:'100%',
        display:'flex',
        alignItems:'center',
        position:'absolute',
        justifyContent:'center'
    },
    video:{
        height:Dimensions.get('screen').height,
        width:Dimensions.get('screen').width + 100
    },
    followButtonContainer:{
        width:25,
        height:25,
        bottom:0,
        display:'flex',
        borderRadius:20,
        alignItems:'center',
        position:'absolute',
        justifyContent:'center'
    },
    content:{
        height:'100%',
        display:'flex',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    textsContainer:{
        width:'100%',
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    texts:{
        width:'75%',
        height:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'flex-end',
        justifyContent:'flex-start'
    },
    textsContent:{
        paddingVertical:10,
        paddingHorizontal:20
    },
    username:{
        fontSize:15,
        color:'#fff',
        paddingBottom:5
    },
    noBackground:{
        width:50,
        height:50,
        borderRadius:50,
        backgroundColor:'#fff'
    },
    description:{
        fontSize:12,
        color:'#fff',
        paddingBottom:10
    },
    interactions:{
        display:'flex',
        paddingBottom:200
    },
    userProfile:{
        display:'flex',
        marginBottom:5,
        paddingVertical:20,
        alignItems:'center',
        justifyContent:'center'
    },
    followIcon:{
        left:20,
        bottom:-15,
        position:'absolute'
    },
    itemContainer:{
        display:'flex',
        marginVertical:3,
        alignItems:'center',
        justifyContent:'center'
    },
    number:{
        color:'#fff',
        marginBottom:10
    }
});





// Export
export default Post;