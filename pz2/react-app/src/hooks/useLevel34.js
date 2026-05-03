import { useState, useMemo, useRef, useEffect } from 'react';

const initialUsers = [
  { id: 1, name: 'Віталій', email: 'vitaliy@example.com', groups: [] },
  { id: 2, name: 'Іван', email: 'ivan@example.com', groups: ['нові'] },
  { id: 3, name: 'Марія', email: 'maria@example.com', groups: ['цільова аудиторія', 'нові'] },
  { id: 4, name: 'Олександр', email: 'alex@example.com', groups: ['постійні клієнти'] },
  { id: 5, name: 'Олена', email: 'olena@example.com', groups: ['постійні клієнти', 'цільова аудиторія'] },
];

export const useLevel34 = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('Всі групи');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [customGroupName, setCustomGroupName] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableGroups = useMemo(() => {
    const groups = new Set(['нові', 'цільова аудиторія', 'постійні клієнти']);
    users.forEach(user => user.groups.forEach(g => groups.add(g)));
    return Array.from(groups);
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = filterGroup === 'Всі групи' || user.groups.includes(filterGroup);
        return matchesSearch && matchesGroup;
      })
      .sort((a, b) => {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      });
  }, [users, searchTerm, filterGroup, sortOrder]);

  const addCustomGroup = () => {
    const trimmed = customGroupName.trim();
    if (trimmed && !selectedGroups.includes(trimmed)) {
      setSelectedGroups([...selectedGroups, trimmed]);
      setCustomGroupName('');
    }
  };

  const addUser = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    
    let finalGroups = [...selectedGroups];
    const trimmed = customGroupName.trim();
    if (trimmed && !finalGroups.includes(trimmed)) {
      finalGroups.push(trimmed);
    }
    
    const newUser = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      groups: finalGroups
    };
    
    setUsers([...users, newUser]);
    setNewName('');
    setNewEmail('');
    setSelectedGroups([]);
    setCustomGroupName('');
    setShowAddForm(false);
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const toggleGroupSelection = (group) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter(g => g !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  return {
    users, searchTerm, setSearchTerm, filterGroup, setFilterGroup,
    sortOrder, setSortOrder, isSelectOpen, setIsSelectOpen, selectRef,
    availableGroups, filteredUsers, showAddForm, setShowAddForm,
    newName, setNewName, newEmail, setNewEmail, selectedGroups,
    customGroupName, setCustomGroupName, addCustomGroup, addUser,
    deleteUser, toggleGroupSelection
  };
};
