// Imports
import {useContext} from 'react';
import {Link} from 'react-router-native';
import {AuthContext} from '../context/Auth';
import UsersList from '../components/UsersList';
import {View, Text, StyleSheet} from 'react-native';





// Main Function
const Inbox = ({theme}) => {

  const {user} = useContext(AuthContext);

  return (
    user ? (
      <UsersList theme={theme}/>
    ):(
      <View style={styles.authenticatedContainer}>
        <Text style={styles.authenticationText}>Login to chat with your friends..</Text>
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
  authenticatedContainer:{
    height:'100%',
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  authenticationText:{
    color:'#fff'
  },
});





// Export
export default Inbox;