import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Edit2, Shield, Eye, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { PERMISSION_MODULES } from '../constants';
import { useToast } from '../context/ToastContext';
import { RoleDefinition, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

// Types for the local state
interface ModuleState {
  read: boolean;
  write: boolean;
  edit: boolean;
  delete: boolean;
}

interface PermissionsState {
  [category: string]: {
    [subModule: string]: ModuleState;
  };
}

// Helper to normalize permissions against the latest PERMISSION_MODULES constant
const normalizePermissions = (rawPermissions: any): PermissionsState => {
  const normalized: PermissionsState = {};
  
  Object.entries(PERMISSION_MODULES).forEach(([category, subModules]) => {
    normalized[category] = {};
    subModules.forEach(sub => {
      if (rawPermissions && rawPermissions[category] && rawPermissions[category][sub]) {
        normalized[category][sub] = { ...rawPermissions[category][sub] };
      } else {
        normalized[category][sub] = { read: false, write: false, edit: false, delete: false };
      }
    });
  });
  
  return normalized;
};

export const Roles: React.FC = () => {
  const { showToast } = useToast();
  const { user, roles, updateRole, getPermission } = useAuth();
  
  // Check permission for "Settings.Role" submodule
  const roleModulePerm = getPermission('Settings.Role');
  const hasEditPermission = roleModulePerm.edit || roleModulePerm.write;

  // View State
  const [view, setView] = useState<'list' | 'edit'>('list');
  
  // Editor State
  const [currentRoleId, setCurrentRoleId] = useState<string | null>(null);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<PermissionsState>({});

  // Determine if the *Target* role being edited is the Root/Super Admin role
  const isTargetRootRole = currentRoleId === 'role_super_admin';

  // Permission logic: User must have edit/write rights on 'Settings.Role' AND cannot edit the Root role
  const canEdit = hasEditPermission && !isTargetRootRole;

  const handleEditRole = (role: RoleDefinition) => {
    setCurrentRoleId(role.id);
    setRoleName(role.name);
    setDescription(role.description);
    setPermissions(normalizePermissions(role.permissions));
    setView('edit');
  };

  const handleCreateNew = () => {
    if (!hasEditPermission) return;
    
    setCurrentRoleId(null);
    setRoleName('');
    setDescription('');
    setPermissions(normalizePermissions({}));
    setView('edit');
  };

  const togglePermission = (category: string, subModule: string, type: keyof ModuleState) => {
    if (!canEdit) return; 

    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subModule]: {
          ...prev[category][subModule],
          [type]: !prev[category][subModule][type]
        }
      }
    }));
  };

  const toggleAllInRow = (category: string, subModule: string, checked: boolean) => {
    if (!canEdit) return; 

    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subModule]: {
          read: checked,
          write: checked,
          edit: checked,
          delete: checked
        }
      }
    }));
  };

  // --- Category Level Toggle ---
  const isCategoryFullyChecked = (category: string) => {
    const subModules = PERMISSION_MODULES[category];
    if (!subModules) return false;
    
    return subModules.every(sub => {
      const p = permissions[category]?.[sub];
      return p?.read && p?.write && p?.edit && p?.delete;
    });
  };

  const toggleCategory = (category: string, checked: boolean) => {
    if (!canEdit) return;

    setPermissions(prev => {
      const updatedCategory: { [key: string]: ModuleState } = {};
      PERMISSION_MODULES[category].forEach(sub => {
        updatedCategory[sub] = {
          read: checked,
          write: checked,
          edit: checked,
          delete: checked
        };
      });

      return {
        ...prev,
        [category]: updatedCategory
      };
    });
  };

  // --- Global Level Toggle ---
  const isGlobalFullyChecked = () => {
    return Object.keys(PERMISSION_MODULES).every(cat => isCategoryFullyChecked(cat));
  };

  const toggleGlobal = (checked: boolean) => {
    if (!canEdit) return;

    const newPermissions: PermissionsState = {};
    Object.entries(PERMISSION_MODULES).forEach(([category, subModules]) => {
      newPermissions[category] = {};
      subModules.forEach(sub => {
        newPermissions[category][sub] = {
          read: checked,
          write: checked,
          edit: checked,
          delete: checked
        };
      });
    });
    setPermissions(newPermissions);
  };

  const handleSave = () => {
    if (!canEdit) return;

    if (!roleName.trim()) {
      showToast('Role Name is required', 'error');
      return;
    }

    setLoading(true);
    
    // Simulate API save
    setTimeout(() => {
      const newRole: RoleDefinition = {
        id: currentRoleId || `role_${Date.now()}`,
        name: roleName,
        description,
        permissions
      };

      updateRole(newRole);

      if (currentRoleId) {
        showToast(`Role "${roleName}" updated successfully`, 'success');
      } else {
        showToast(`Role "${roleName}" created successfully`, 'success');
      }
      
      setLoading(false);
      setView('list');
    }, 800);
  };

  // --- RENDER LIST VIEW ---
  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Roles & Permissions</h1>
            <p className="text-slate-500 text-sm">Manage user roles and access levels</p>
          </div>
          {hasEditPermission && (
            <Button onClick={handleCreateNew}>
              <Plus className="w-4 h-4 mr-2" /> Add New Role
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <div key={role.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col transition-all hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${role.id === 'role_super_admin' ? 'bg-purple-50 text-purple-600' : 'bg-primary-50 text-primary-600'}`}>
                  <Shield className="w-6 h-6" />
                </div>
                {role.id === 'role_super_admin' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase tracking-wider">
                    Root
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{role.name}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-1">{role.description}</p>
              
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <Button variant="outline" className="w-full" onClick={() => handleEditRole(role)}>
                  {hasEditPermission && role.id !== 'role_super_admin' ? (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" /> Manage Permissions
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" /> View Permissions
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDER EDITOR VIEW ---
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('list')}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {currentRoleId ? (canEdit ? 'Edit Role' : 'View Role') : 'Add New Role'}
            </h1>
            <p className="text-slate-500 text-sm">
              {canEdit ? 'Configure access permissions' : 'Read-only permission view'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView('list')}>
            {canEdit ? 'Cancel' : 'Back'}
          </Button>
          {canEdit && (
            <Button onClick={handleSave} isLoading={loading}>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Info Banner for Root Role */}
      {isTargetRootRole && (
        <div className="bg-purple-50 border border-purple-200 text-purple-800 px-4 py-3 rounded-lg flex items-start sm:items-center gap-3 animate-fadeIn">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <p className="text-sm font-semibold">Root Access</p>
            <p className="text-xs sm:text-sm mt-1 sm:mt-0 opacity-90">
              The Super Admin role has inherent full access to all modules and cannot be modified. 
              New modules are automatically enabled for this role.
            </p>
          </div>
        </div>
      )}

      {/* Info Banner for Read-Only mode */}
      {!canEdit && !isTargetRootRole && (
        <div className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-3 rounded-lg flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <p className="text-sm">You are viewing this role in read-only mode.</p>
        </div>
      )}

      {/* Role Details */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="max-w-3xl space-y-4">
          <Input 
            label="Role Name" 
            placeholder="e.g. Sales Manager"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            disabled={!canEdit}
            className={!canEdit ? "bg-slate-50 cursor-not-allowed text-slate-500" : ""}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              className={`w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-500/10 h-24 resize-none transition-all duration-200 ${
                !canEdit ? "bg-slate-50 cursor-not-allowed text-slate-500" : ""
              }`}
              placeholder="Describe the purpose of this role..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="space-y-6">
        
        {/* Global Select All */}
        {canEdit && (
          <div className="flex items-center justify-end px-2">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-sm font-medium text-slate-700">Grant Full Access (All Modules)</span>
              <Checkbox 
                checked={isGlobalFullyChecked()}
                onChange={toggleGlobal}
                disabled={!canEdit}
              />
            </div>
          </div>
        )}

        {Object.entries(PERMISSION_MODULES).map(([category, subModules]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Category Header with Toggle */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">{category}</h3>
              {canEdit && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Select All {category}</span>
                  <Checkbox 
                    checked={isCategoryFullyChecked(category)}
                    onChange={(val) => toggleCategory(category, val)}
                    disabled={!canEdit}
                  />
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 font-medium border-b border-slate-100 bg-white">
                  <tr>
                    <th className="px-6 py-3 w-1/3">Module</th>
                    <th className="px-6 py-3 text-center w-1/6">
                      <span className="flex items-center justify-center gap-1">Read</span>
                    </th>
                    <th className="px-6 py-3 text-center w-1/6">
                      <span className="flex items-center justify-center gap-1">Write</span>
                    </th>
                    <th className="px-6 py-3 text-center w-1/6">
                      <span className="flex items-center justify-center gap-1">Edit</span>
                    </th>
                    <th className="px-6 py-3 text-center w-1/6">
                      <span className="flex items-center justify-center gap-1">Delete</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subModules.map((subModule) => {
                    // Safe access to permission object
                    const modulePerms = permissions[category]?.[subModule] || { 
                      read: false, write: false, edit: false, delete: false 
                    };
                    
                    const allChecked = modulePerms.read && modulePerms.write && modulePerms.edit && modulePerms.delete;
                    
                    return (
                      <tr key={subModule} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3 font-medium text-slate-700 uppercase text-xs tracking-wide">
                          <div className="flex items-center gap-3">
                             {/* Row Master Toggle */}
                             <Checkbox 
                               checked={allChecked}
                               onChange={(val) => toggleAllInRow(category, subModule, val)}
                               disabled={!canEdit}
                             />
                             {subModule}
                          </div>
                        </td>
                        {(['read', 'write', 'edit', 'delete'] as const).map((type) => (
                          <td key={type} className="px-6 py-3">
                            <div className="flex items-center justify-center">
                              <Checkbox 
                                checked={modulePerms[type]}
                                onChange={() => togglePermission(category, subModule, type)}
                                disabled={!canEdit}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Footer for Actions - Only show if editable */}
      {canEdit && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:pl-64 flex justify-end gap-3 z-10 shadow-lg">
           <Button variant="outline" onClick={() => setView('list')}>Cancel</Button>
           <Button onClick={handleSave} isLoading={loading}>Save Changes</Button>
        </div>
      )}
    </div>
  );
};