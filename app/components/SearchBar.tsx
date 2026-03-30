import { Searchbar } from 'react-native-paper';

interface SearchBarProps {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar = ({ visible, value, onChangeText }: SearchBarProps) => {
  if (!visible) return null;
  
  return (
    <Searchbar
      placeholder="Search"
      value={value}
      onChangeText={onChangeText}
      className="mx-2.5 my-2 rounded-lg "
    />
  );
};