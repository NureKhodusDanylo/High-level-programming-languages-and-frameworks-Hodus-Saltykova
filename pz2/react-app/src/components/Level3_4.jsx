import React from 'react';
import { useLevel34 } from '../hooks/useLevel34';

const Level3_4 = () => {
  const {
    searchTerm, setSearchTerm, filterGroup, setFilterGroup,
    sortOrder, setSortOrder, isSelectOpen, setIsSelectOpen, selectRef,
    availableGroups, filteredUsers, showAddForm, setShowAddForm,
    newName, setNewName, newEmail, setNewEmail, selectedGroups,
    customGroupName, setCustomGroupName, addCustomGroup, addUser,
    deleteUser, toggleGroupSelection
  } = useLevel34();

  return (
    <section className="mb-12 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary-container">Рівні 3-4: Список користувачів</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`sketch-border-thin px-4 py-1 text-xs font-bold flex items-center gap-2 transition-all ${showAddForm ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}
        >
          <span className="material-symbols-outlined text-sm">{showAddForm ? 'close' : 'person_add'}</span>
          {showAddForm ? 'Скасувати' : 'Додати користувача'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={addUser} className="sketch-border p-6 mb-8 bg-surface-container-lowest animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase text-outline mb-1">Ім'я</label>
              <input 
                type="text" 
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="w-full p-2 sketch-border-thin bg-surface focus:outline-none" 
                placeholder="Введіть ім'я..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-outline mb-1">Email</label>
              <input 
                type="email" 
                value={newEmail} 
                onChange={e => setNewEmail(e.target.value)}
                className="w-full p-2 sketch-border-thin bg-surface focus:outline-none" 
                placeholder="example@mail.com"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase text-outline mb-2">Оберіть або створіть групи</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableGroups.concat(selectedGroups.filter(g => !availableGroups.includes(g))).map(group => (
                <button
                  key={group}
                  type="button"
                  onClick={() => toggleGroupSelection(group)}
                  className={`px-3 py-1 sketch-border-thin text-[10px] font-bold uppercase transition-all ${selectedGroups.includes(group) ? 'bg-tertiary-fixed text-tertiary shadow-sm' : 'bg-surface-variant text-outline'}`}
                >
                  {group}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={customGroupName}
                onChange={e => setCustomGroupName(e.target.value)}
                onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addCustomGroup(); } }}
                placeholder="Нова група..."
                className="flex-grow p-2 text-sm sketch-border-thin bg-surface focus:outline-none italic"
              />
              <button 
                type="button"
                onClick={addCustomGroup}
                className="sketch-border-thin bg-tertiary-fixed-dim text-tertiary-container w-10 h-10 flex items-center justify-center hover:bg-tertiary-fixed transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
          <button type="submit" className="w-full sketch-border bg-primary-container text-white py-2 font-bold hover:bg-opacity-90">
            Зберегти користувача
          </button>
        </form>
      )}
      
      <div className="sketch-border p-4 mb-6 bg-surface-container-low flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            placeholder="Пошук за ім'ям..."
            className="w-full pl-10 pr-4 py-2 bg-surface-container-high sketch-border-thin focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-64" ref={selectRef}>
          <button 
            type="button"
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-surface-container-high sketch-border-thin focus:outline-none text-sm font-bold"
          >
            <span className="truncate">{filterGroup}</span>
            <span className={`material-symbols-outlined transition-transform shrink-0 ${isSelectOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>
          
          {isSelectOpen && (
            <div className="absolute z-50 top-full left-0 w-full mt-1 bg-surface-container-highest sketch-border shadow-xl py-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95">
              <button
                onClick={() => { setFilterGroup('Всі групи'); setIsSelectOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-tertiary-fixed-dim transition-colors ${filterGroup === 'Всі групи' ? 'bg-tertiary-fixed text-tertiary font-bold' : ''}`}
              >
                Всі групи
              </button>
              {availableGroups.map(group => (
                <button
                  key={group}
                  onClick={() => { setFilterGroup(group); setIsSelectOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-tertiary-fixed-dim transition-colors ${filterGroup === group ? 'bg-tertiary-fixed text-tertiary font-bold' : ''}`}
                >
                  {group}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          className="w-full md:w-auto sketch-border-thin bg-surface-container-high px-4 py-2 flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors text-sm font-bold shrink-0"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <span className="material-symbols-outlined">sort_by_alpha</span>
          {sortOrder === 'asc' ? "А-Я" : "Я-А"}
        </button>
      </div>

      <div className="space-y-4">
        {filteredUsers.length > 0 ? filteredUsers.map(user => (
          <div key={user.id} className="sketch-border p-4 flex items-center gap-4 bg-surface hover:sketch-shadow transition-all group relative">
            <div className="w-12 h-12 sketch-border-thin flex items-center justify-center bg-secondary-fixed text-secondary shrink-0">
              <span className="material-symbols-outlined text-2xl">person</span>
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-lg leading-tight truncate">{user.name}</h3>
              <div className="flex items-center gap-1 text-sm text-on-surface-variant truncate">
                <span className="material-symbols-outlined text-sm shrink-0">mail</span>
                {user.email}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end items-center shrink-0">
              {user.groups.length > 0 ? user.groups.map(group => (
                <span key={group} className="tag px-2 py-0.5 sketch-border-thin text-[10px] uppercase font-bold bg-tertiary-fixed text-tertiary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">sell</span>
                  {group}
                </span>
              )) : (
                <span className="px-2 py-0.5 sketch-border-thin text-[10px] uppercase font-bold bg-surface-variant text-outline flex items-center gap-1">
                  Без групи
                </span>
              )}
              
              <button 
                onClick={() => deleteUser(user.id)}
                className="ml-2 w-8 h-8 flex items-center justify-center text-error hover:bg-error-container hover:sketch-border-thin rounded-full transition-all md:opacity-0 group-hover:opacity-100"
                title="Видалити"
              >
                <span className="material-symbols-outlined text-xl">delete</span>
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 sketch-border bg-surface-container-lowest text-outline italic">
            Користувачів не знайдено
          </div>
        )}
      </div>
    </section>
  );
};

export default Level3_4;
