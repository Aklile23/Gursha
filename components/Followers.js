// Imports
import axios from 'axios';
import {SERVER_API} from '@env';
import {useEffect, useState} from 'react';
import {AntDesign} from '@expo/vector-icons';
import AnotherUserProfile from '../pages/AnotherUserProfile';
import {Modal, StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';





// Main function
const Followers = ({isFollowersOpened, setIsFollowersOpened, userId, theme}) => {



    // Another user modal
    const [isUserModalOpened, setIsUserModalOpened] = useState(false);
    const [selectedUser, setSelctedUser] = useState({});
    const [isFollowIconVisible, setIsFollowIconVisible] = useState(true);



    // Fetching users
    const [users, setUsers] = useState([{}]);
    const usersFetcher = async () => {
        try {
            const link = `${SERVER_API}/users/followers/${userId}`
            const res = await axios.get(link);
            setUsers(res.data);
        } catch (err) {
            console.log(err);
        };
    };



    // Use effect
    useEffect(() => {
        usersFetcher();
    }, []);
    useEffect(() => {
        usersFetcher();
    }, [isUserModalOpened]);



    return (
        <Modal visible={isFollowersOpened}>
            <AnotherUserProfile
                isUserModalOpened={isUserModalOpened}
                setIsUserModalOpened={setIsUserModalOpened}
                isFollowIconVisible={isFollowIconVisible}
                setIsFollowIconVisible={setIsFollowIconVisible}
                user={selectedUser}
                theme={theme}
            />
            <View style={styles.container}>
                <View style={styles.backButton}>
                    <TouchableOpacity
                        onPress={() => setIsFollowersOpened(false)}
                        style={styles.backIcon}
                    >
                        <AntDesign name="arrowleft" size={30} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.header}>Followers</Text>
                <View style={styles.usersList}>
                    {users.map(user => (
                        <TouchableOpacity style={styles.searchedUser} onPress={() => {
                            setSelctedUser(user);
                            setIsUserModalOpened(true);
                        }}>
                            {user?.profilePic ? (
                                <Image
                                    source={{uri:user.profilePic}}
                                    style={styles.image}
                                />
                            ) : (
                                <View style={[styles.image, {backgroundColor:'#fff'}]}/>
                            )}
                            <View style={styles.texts}>
                                <Text style={styles.username}>{user.username}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};





// Styles
const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        backgroundColor:'#000'
    },
    backButton:{
        zIndex:1,
        width:'100%',
        borderColor:'#ccc',
        position:'absolute',
        borderBottomWidth:1,
        backgroundColor:'#000'
    },
    backIcon:{
        width:75,
        paddingLeft:20,
        paddingVertical:10
    },
    header:{
        fontSize:20,
        color:'#fff',
        marginTop:70,
        marginBottom:50,
        textAlign:'center'
    },
    searchedUser:{
        width:'100%',
        display:'flex',
        paddingVertical:10,
        borderColor:'#ccc',
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:20,
        borderBottomWidth:0.5
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
export default Followers;