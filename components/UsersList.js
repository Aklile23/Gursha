// Imports
import Chat from './Chat';
import axios from 'axios';
import {SERVER_API} from '@env';
import {db} from '../src/firebase';
import {Entypo} from '@expo/vector-icons';
import {AuthContext} from '../context/Auth';
import {AntDesign} from '@expo/vector-icons';
import {ActivityIndicator} from 'react-native-paper';
import {useState, useContext, useEffect} from 'react';
import {Image, View, StyleSheet, TextInput, Text, TouchableOpacity} from 'react-native';
import {collection, query, where, getDoc, setDoc, doc, updateDoc, serverTimestamp, getDocs, onSnapshot} from 'firebase/firestore';





// Main function
const UsersList = ({theme}) => {



    // User
    const {user:registeredUser} = useContext(AuthContext);
    const [searchedUser, setSearchedUser] = useState({});
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([{}]);
    const [isChatOpened, setIsChatOpened] = useState(false);
    const [isUserSearched, setIsUserSearched] = useState(false);
    const [chats, setChats] = useState([]);



    // Search users
    const searchUser = async () => {
        try {
            const q = query(
                collection(db, 'users'),
                where('username', '==', username)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async doc => {
                const link = `${SERVER_API}/users/${doc.data().username}`;
                const res = await axios.get(link);
                setSearchedUser(res.data);
                setIsUserSearched(true);
            });
        } catch (err) {
            console.log(err);
        }
    };



    // Select user
    const selectUser = async ({id, username}) => {
        try {
            const combinedId =
            !id
            ? registeredUser._id > searchedUser?._id
                ? registeredUser._id + searchedUser?._id
                : searchedUser?._id + registeredUser._id
            : registeredUser._id > id
                ? registeredUser._id + id
                : id + registeredUser._id;
            const res = await getDoc(doc(db, 'chats', combinedId));
            if(!res.exists()){
                setDoc(doc(db, 'chats', combinedId), {messages:[]}).then(() => {
                    updateDoc(doc(db, 'userChats', registeredUser._id), {
                        [combinedId+'.userInfo']:{
                            id:id ? id : searchedUser?._id,
                            username:username ? username : searchedUser?.username
                        },
                        [combinedId+'.date']:serverTimestamp()
                    });
                    updateDoc(doc(db, 'userChats', id ? id : searchedUser?._id), {
                        [combinedId+'.userInfo']:{
                            id:registeredUser._id,
                            username:registeredUser.username
                        },
                        [combinedId+'.date']:serverTimestamp()
                    });
                });
            };
            setIsChatOpened(true);
            setUsername('');
        } catch (err) {
            console.log(err);
        };
    };



    // Fetching all users
    const fetchUsers = () => {        
        onSnapshot(doc(db, 'userChats', registeredUser._id), doc => {
            let urls = [];
            const docs = doc?.data() ? Object?.values(doc?.data()) : [];
            setChats(docs);
            docs.map(u => {
                urls.push(`${SERVER_API}/users/${u?.userInfo?.username}`);
            });
            const reqs = urls?.map(url => axios.get(url));
            axios.all(reqs).then(res => {
                setUsers(res?.map(r => r?.data).map(user => {
                    const userChat = chats.filter(chat => chat?.userInfo?.username === user?.username);
                    return{
                        ...user,
                        lastMessage:userChat[0]?.lastMessage ? userChat[0]?.lastMessage?.input : ''
                    };
                }));
            });
        });
    };



    // Use effect
    useEffect(() => {
        fetchUsers();
    }, []);



    return (
        <View style={styles.container}>
            <Chat
                isChatOpened={isChatOpened}
                setIsChatOpened={setIsChatOpened}
                searchedUser={searchedUser}
                setIsUserSearched={setIsUserSearched}
                theme={theme}
            />
            <TouchableOpacity style={[styles.searchView, {borderBottomWidth:isUserSearched ? 0 : 1}]}>
                <TextInput 
                    placeholder='Search by name...'
                    style={styles.input}
                    value={username}
                    placeholderTextColor='#fff'
                    onChangeText={text => {
                        setUsername(text);
                        searchUser();
                    }}
                />
                <TouchableOpacity
                    onPress={() => searchUser()}
                    style={styles.searchIcon}
                >
                    <Entypo name="magnifying-glass" size={30} color="#fff" />
                </TouchableOpacity>
                {username && (
                    <TouchableOpacity
                        style={styles.closeIcon}
                        onPress={() => {
                            setUsername('');
                            setSearchedUser({});
                            setIsUserSearched(false);
                        }}
                    >
                        <AntDesign name="close" size={30} color="#fff" />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
            {isUserSearched && (
                <TouchableOpacity style={styles.searchedUser} onPress={selectUser}>
                    {searchedUser?.profilePic ? (
                        <Image
                            source={{uri:searchedUser?.profilePic}}
                            style={styles.image}
                        />
                    ) : (
                        <View style={[styles.image, {backgroundColor:'#fff'}]}/>
                    )}
                    <View style={styles.texts}>
                        <Text style={styles.username}>{searchedUser?.username}</Text>
                    </View>
                </TouchableOpacity>
            )}
            <View style={styles.users}>
                {users.length > 0 ? 
                    users[0]?.username
                        ? users?.map(user => (
                            <TouchableOpacity style={styles.user} key={user?._id} onPress={() => {setSearchedUser(user);selectUser({id:user._id, username:user.username})}}>
                                {user?.profilePic ? (
                                    <Image
                                        source={{uri:user?.profilePic}}
                                        style={styles.image}
                                    />
                                ) : (
                                    <View
                                        style={[styles.image, {backgroundColor:'#fff'}]}
                                    />
                                )}
                                <View style={styles.texts}>
                                    <Text style={styles.username}>{user?.username}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                        :(
                            <View style={styles.progressContainer}>
                                <ActivityIndicator animating={true} color='#fff' size={50}/>
                            </View>
                        )
                    : <Text style={{color:'#fff', width:'100%', textAlign:'center', fontSize:18, marginTop:50}}>Search other users...</Text>
                }
            </View>
        </View>
    );
};





// Styles
const styles = StyleSheet.create({
    container:{
        width:'100%',
        display:'flex',
        alignItems:'center'
    },
    searchView:{
        height:80,
        width:'100%',
        borderColor:'#ccc'
    },
    progressContainer:{
        paddingTop:50
    },
    input:{
        color:'#fff',
        height:'100%',
        paddingLeft:60
    },
    searchIcon:{
        top:25,
        left:10,
        position:'absolute'
    },
    closeIcon:{
        top:25,
        right:10,
        position:'absolute'
    },
    users:{
        width:'100%'
    },
    user:{
        width:'100%',
        display:'flex',
        borderColor:'#ccc',
        paddingVertical:10,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        paddingHorizontal:20
    },
    searchedUser:{
        width:'100%',
        paddingTop:10,
        display:'flex',
        paddingBottom:50,
        borderColor:'#ccc',
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        paddingHorizontal:20
    },
    image:{
        width:75,
        height:75,
        borderRadius:50
    },
    texts:{
        width:'100%',
        marginLeft:10
    },
    username:{
        fontSize:15,
        color:'#fff'
    }
});





// Export
export default UsersList;