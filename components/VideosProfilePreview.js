// Imports
import {Video} from 'expo-av';
import {useState} from 'react';
import VideosModal from './VideosModal';
import {FlatGrid} from 'react-native-super-grid';
import {StyleSheet, View,  Dimensions, TouchableOpacity} from 'react-native';





// Main function
const VideosProfilePreview = ({posts, theme, isCommentPosted, setIsCommentPosted}) => {



    // Videos modal opening
    const [isVideosModalOpened, setIsVideosModalOpened] = useState(false);



    return (
        <View>
            <FlatGrid
                data={posts}
                style={styles.gridView}
                staticDimension={Dimensions.get('screen').width}
                spacing={0}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => setIsVideosModalOpened(true)}>
                        <Video
                            source={{uri:item.video}}
                            resizeMode='contain'
                            style={styles.video}
                        />
                    </TouchableOpacity>
                )}
            />
            <VideosModal
                posts={posts}
                theme={theme}
                isVideosModalOpened={isVideosModalOpened}
                setIsVideosModalOpened={setIsVideosModalOpened}
                isCommentPosted={isCommentPosted}
                setIsCommentPosted={setIsCommentPosted}
            />
        </View>
    );
};






// Styles
const styles = StyleSheet.create({
    gridView: {
        flex:1,
        paddingBottom:55
    },
    itemContainer: {
        height:220,
        borderWidth:0.2,
        borderColor:'#ccc',
        justifyContent:'flex-end'
    },
    video:{
        height:220
    }
});





// Export
export default VideosProfilePreview;