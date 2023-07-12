// Imports
import axios from 'axios';
import {SERVER_API} from '@env';
import Home from '../pages/Home';
import Info from '../pages/Info';
import Edit from '../pages/Edit';
import Inbox from '../pages/Inbox';
import Login from '../pages/Login';
import Search from '../pages/Search';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import AddVideo from '../pages/AddVideo';
import {Entypo} from '@expo/vector-icons';
import {AuthContext} from '../context/Auth';
import {Ionicons} from '@expo/vector-icons';
import {FontAwesome} from '@expo/vector-icons';
import FollowingPage from '../pages/FollowingPage';
import {useState, useEffect, useContext} from 'react';
import {Route, Link, Routes} from 'react-router-native';
import {View, StyleSheet, Text, Dimensions} from 'react-native';





// Main Function
const Navbar = ({theme}) => {



    // User
    const {user} = useContext(AuthContext);


    // Fetching posts
    const [posts, setPosts] = useState([{}]);
    const [playingVideoId, setPlayingVideoId] = useState('');
    const postsFetcher = async e => {
        try {
        const link = `${SERVER_API}/posts/`;
        const res = await axios.get(link);
        const userVideosFilter = res.data.filter(post => user ? post.user !== user._id : post);
        setPosts(userVideosFilter);
        setPlayingVideoId(res.data[0]?._id);
        } catch (err) {
        console.log(err);
        }
    };



    // Comment check
    const [isCommentPosted, setIsCommentPosted] = useState(false);



    // Use effect
    useEffect(() => {
        postsFetcher();
    }, [isCommentPosted, user]);
    useEffect(() => {
        postsFetcher();
    }, []);



    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Routes>
                    <Route exact path="/" element={<Home
                        theme={theme}
                        posts={posts}
                        isCommentPosted={isCommentPosted}
                        setIsCommentPosted={setIsCommentPosted}
                        playingVideoId={playingVideoId}
                        setPlayingVideoId={setPlayingVideoId}
                    />} />
                    <Route path="/search" element={<Search
                        theme={theme}
                        posts={posts}
                        isCommentPosted={isCommentPosted}
                        setIsCommentPosted={setIsCommentPosted}
                    />} />
                    <Route exact path="/following" element={<FollowingPage theme={theme} />} />
                    <Route path="/inbox" element={<Inbox theme={theme}/>} />
                    <Route path="/add" element={<AddVideo theme={theme} />} />
                    <Route path="/profile" element={<Profile theme={theme} />} />
                    <Route path="/edit" element={<Edit theme={theme} />} />
                    <Route path="/login" element={<Login theme={theme} />} />
                    <Route path="/register" element={<Register theme={theme} />} />
                    <Route path="/info" element={<Info theme={theme} />} />
                </Routes>
            </View>
            <View style={styles.nav}>
                <Link to="/" style={styles.navItem}>
                    <View style={styles.tabContainer}>
                        <FontAwesome name="home" size={30} color="#fff" />
                        <Text style={styles.text}>Home</Text>
                    </View>
                </Link>
                <Link to="/search" style={styles.navItem}>
                    <View style={styles.tabContainer}>
                        <Entypo name="magnifying-glass" size={30} color="#fff" />
                        <Text style={styles.text}>Search</Text>
                    </View>
                </Link>
                <Link to="/add" style={styles.navItem}>
                    <View style={styles.addVideoContainer}>
                        <Text style={styles.addVideoIcon}>+</Text>
                    </View>
                </Link>
                <Link to="/inbox" style={styles.navItem}>
                    <View style={styles.tabContainer}>
                        <FontAwesome name="inbox" size={30} color="#fff" />
                        <Text style={styles.text}>Inbox</Text>
                    </View>
                </Link>
                <Link to="/profile" style={styles.navItem}>
                    <View style={styles.tabContainer}>
                        <Ionicons name="person" size={30} color="#fff" />
                        <Text style={styles.text}>Profile</Text>
                    </View>
                </Link>
            </View>
        </View>
    );
};





// Styles
const styles = StyleSheet.create({
    container:{
        height:Dimensions.get('screen').height
    },
    content:{
        backgroundColor:'#000',
        height:Dimensions.get('screen').height - 100,
    },
    nav:{
        width:'100%',
        display:'flex',
        borderTopWidth:1,
        borderColor:'#ccc',
        flexDirection:'row',
        backgroundColor:'#000'
    },
    navItem:{
        flex:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        
    },
    tabContainer:{
        width:'100%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        fontSize:10,
        color:'#fff'
    },
    addVideoContainer:{
        width:65,
        display:'flex',
        borderRadius:10,
        textAlign:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    addVideoIcon:{
        fontSize:30,
        color:'#000',
        marginTop:-6
    }
});





// Export
export default Navbar;
// underlayColor="#f0f4f7"