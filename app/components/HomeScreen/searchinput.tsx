import React from 'react';
import { TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import SearchIcon from './search_icon';
import Typography from '@/constants/typography';
 
interface SearchBarProps {
  onSearch?: (query: string) => void;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  value?: string;
  backgroundColor?: string;
  disabled?: boolean;
  isSearching?: boolean;
  showNoResults?: boolean;
}
 
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onChangeText,
  placeholder = "Search",
  value = "",
  backgroundColor = "bg-river-blue-2",
  disabled = false,
  isSearching = false,
  showNoResults = false
}) => {
  const theme = useTheme();
  const [searchText, setSearchText] = React.useState(value);
 
  // Update local state when value prop changes
  React.useEffect(() => {
    setSearchText(value);
  }, [value]);
 
  // Clear search text when showNoResults becomes true
  React.useEffect(() => {
    if (showNoResults) {
      setSearchText('');
    }
  }, [showNoResults]);
 
  const handleSearchChange = (text: string) => {
    setSearchText(text);
   
    // Call parent's onChangeText to reset showNoResults when user types
    if (onChangeText) {
      onChangeText(text);
    }
  };
 
  const handleSearchSubmit = () => {
    if (searchText.trim() && onSearch && !disabled && !isSearching) {
      onSearch(searchText.trim());
    }
  };
 
  const handleClearSearch = () => {
    setSearchText('');
    if (onChangeText) {
      onChangeText('');
    }
  };
 
  // Determine placeholder text and color
  const getPlaceholderText = () => {
    if (showNoResults) return "No Results Found";
    if (isSearching) return "Searching...";
    if (disabled) return "Searching...";
    return placeholder;
  };
 
  const getPlaceholderColor = () => {
    if (showNoResults) return "#61A0D1"; // Red color for no results
    return "#61A0D1"; // Default blue color
  };
 
  // Always show placeholder when showNoResults is true, regardless of searchText
  const shouldShowPlaceholder = !searchText || isSearching || showNoResults;
 
  return (
    <View
      className={`w-88 h-[48px] rounded-full ${backgroundColor} gap-2 flex-row items-center px-4 ${disabled ? 'opacity-70' : ''}`}
    >
      <TouchableOpacity
        onPress={handleSearchSubmit}
        disabled={disabled || isSearching}
        style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}
      >
        {isSearching ? (
          <ActivityIndicator
            size="small"
            color="#61A0D1"
            style={{ width: 20, height: 20 }}
          />
        ) : (
          <SearchIcon/>
        )}
      </TouchableOpacity>
     
      <TextInput
        className="flex-1 text-[16px] leading-[24px] text-[#61AFD2] py-0"
        placeholder={getPlaceholderText()}
        placeholderTextColor={getPlaceholderColor()}
        value={showNoResults ? '' : searchText} // Clear value when showing no results
        onChangeText={handleSearchChange}
        onSubmitEditing={handleSearchSubmit}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        editable={!disabled && !isSearching && !showNoResults}
        style={Typography.copy1}
      />
     
      {searchText.length > 0 && !isSearching && !showNoResults && (
        <TouchableOpacity onPress={handleClearSearch} className="ml-2" disabled={disabled}>
          <Ionicons name="close-circle" size={20} color="#61A0D1" />
        </TouchableOpacity>
      )}
    </View>
  );
};
 
export default SearchBar;
 