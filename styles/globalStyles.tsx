import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
    screenContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    mainTileContainer: {
        width: '90%',
        alignItems: 'center',
        padding: 20,
        marginBottom: 20,
        flex: 1,
    },

    modalContainer: {
        width: '90%',
        minHeight: 600,
        borderColor: theme.colors.primary,
        borderWidth: 1,
        backgroundColor: theme.colors.background,
        position: 'relative',
        alignItems: 'center',
        alignSelf: 'center',
        marginHorizontal: 20,
        marginVertical: 115,
        paddingVertical: 10,
    },

    itemContainer: {
        marginVertical: 10,
        padding: 5,
        width: '90%',
        minHeight: 100,
    },

    searchBarContainer: {
        width: '80%',
        borderColor: theme.colors.primary,
        borderBottomWidth: 2,
        paddingBottom: 5,
        paddingTop: 15,
        marginBottom: 10,
    },

    searchBar: {
        
    },

    button: {
        height: 40,
        backgroundColor: theme.colors.primary,
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },

    buttonText: {
        color: '#FFFFFF',
    },
})