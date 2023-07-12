// Imports
import {Video} from 'expo-av';
import {useEffect, useState} from 'react';
import {Entypo} from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';
import {FlatGrid} from 'react-native-super-grid';
import VideosModal from '../components/VideosModal';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, ScrollView} from 'react-native';





// Main function
const Search = ({posts, theme, isCommentPosted, setIsCommentPosted}) => {



    // Input text
    const [input, setInput] = useState('');
    const [message, setMessage] = useState('');
    const [searchedVideos, setSearchedVideos] = useState([{}]);
    const [isVideosModalOpened, setIsVideosModalOpened] = useState(false);



    // Search video
    const videoSearcher = () => {
        if(input){
            const newPosts = posts.filter(post => post.body === input);
            setSearchedVideos(newPosts);
            if(newPosts.length < 1){
                setMessage('No posts found');
                setSearchedVideos([{}]);
            }else{
                setMessage('');
            }
        }else{
            setMessage('No posts found');
            setSearchedVideos([{}]);
        }
    };



    return (
        <View>
            <View style={styles.searchView}>
                <TextInput 
                    placeholder='Search videos...'
                    style={styles.input}
                    value={input}
                    placeholderTextColor='#fff'
                    onChangeText={text => setInput(text)}
                    autoFocus
                />
                <TouchableOpacity
                    onPress={videoSearcher}
                    style={styles.searchIcon}
                >
                    <Entypo name="magnifying-glass" size={30} color="#fff" />
                </TouchableOpacity>
                {input && (
                    <TouchableOpacity
                        style={styles.closeIcon}
                        onPress={() => setInput('')}
                    >
                        <AntDesign name="close" size={30} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>
            {message && <Text style={styles.resultsNumber}>{message}</Text>}
            {searchedVideos[0]?.body && (
                <>                
                    <Text style={styles.resultsNumber}>{searchedVideos.length} Results</Text>
                    <ScrollView>
                        <FlatGrid
                            data={searchedVideos}
                            style={styles.gridView}
                            staticDimension={Dimensions.get('screen').width }
                            spacing={0}
                            renderItem={({item}) => (
                                <TouchableOpacity onPress={() => setIsVideosModalOpened(true)}>
                                    <Video
                                        source={{uri:item.video}}
                                        resizeMode='contain'
                                        style={styles.video}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    </ScrollView>
                    <VideosModal
                        posts={searchedVideos}
                        theme={theme}
                        isVideosModalOpened={isVideosModalOpened}
                        setIsVideosModalOpened={setIsVideosModalOpened}
                        isCommentPosted={isCommentPosted}
                        setIsCommentPosted={setIsCommentPosted}
                    />
                </>
            )}
        </View>
    );
};





// Styles
const styles = StyleSheet.create({
    container:{

    },
    searchView:{
        height:80,
        width:'100%',
        borderColor:'#ccc',
        borderBottomWidth:0.5
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
    resultsNumber:{
        fontSize:18,
        color:'#fff',
        marginTop:20,
        textAlign:'center'
    },
    gridView: {
        flex:1,
        width:'100%',
        marginTop:20,
        paddingBottom:55
    },
    video:{
        height:220
    }
});





// Export
export default Search;