import React, { useEffect, useMemo, useState } from 'react'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'
import { Switch } from '../../components/ui/switch'
import { useAdminsStore } from '../../store/useAdminsStore'
import { useUsersStore } from '../../store/useUsersStore'
import { useLocation, useNavigate } from 'react-router-dom'

const MODULES = [
  'CMS','CUSTOMERS','CATEGORIES','PRODUCTS','ORDERS','PAYMENTS','SHIPPING','NOTIFICATIONS','REPORTS','CHAT','ADMINS'
]
const RIGHTS = ['VIEW','CREATE','UPDATE','DELETE','ACTIVATE','DEACTIVATE','APPROVE','DISAPPROVE']

const useQuery = () => new URLSearchParams(useLocation().search)

const AddAdmin = () => {
  const q = useQuery()
  const editId = q.get('id')
  const navigate = useNavigate()
  const { createAdmin, updateAdmin, getAdmin, isSaving } = useAdminsStore()
  const { users, fetchUsers, isLoading: isUsersLoading } = useUsersStore()

  const [userQuery, setUserQuery] = useState("")
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('ADMIN')
  const [isActive, setIsActive] = useState(true)
  const [permissions, setPermissions] = useState([])

  // Load users for dropdown (searchable)
  useEffect(() => {
    const t = setTimeout(() => {
      fetchUsers({ page: 1, limit: 50, q: userQuery, role: 'CUSTOMER' })
    }, 300)
    return () => clearTimeout(t)
  }, [userQuery])

  // If editing, load admin and prefill form
  useEffect(() => {
    if (!editId) return
    (async () => {
      const a = await getAdmin(editId)
      if (a) {
        setUserId(a.user?._id || '')
        setRole(a.role || 'ADMIN')
        setIsActive(!!a.isActive)
        setPermissions(a.permissions || [])
      }
    })()
  }, [editId])

  const onToggleRight = (module, right) => {
    setPermissions((prev) => {
      const idx = prev.findIndex((p) => p.module === module)
      if (idx === -1) {
        return [...prev, { module, rights: [right] }]
      }
      const rights = new Set(prev[idx].rights)
      if (rights.has(right)) rights.delete(right)
      else rights.add(right)
      const updated = [...prev]
      updated[idx] = { module, rights: Array.from(rights) }
      return updated
    })
  }

  const hasRight = (module, right) => {
    const m = permissions.find((p) => p.module === module)
    return m ? m.rights.includes(right) : false
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = { userId, role, permissions, isActive }
    if (editId) {
      await updateAdmin(editId, payload)
    } else {
      await createAdmin(payload)
    }
    navigate('/dashboard/users/admins')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{editId ? 'Edit Admin' : 'Add Admin'}</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>User</Label>
            <Input
              placeholder="Search users..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="mb-2"
              disabled={!!editId}
            />
            <select className="w-full border rounded px-3 py-2" value={userId} onChange={(e) => setUserId(e.target.value)} disabled={!!editId}>
              <option value="">Select user</option>
              {isUsersLoading ? (
                <option>Loading...</option>
              ) : users.map((u) => (
                <option key={u._id} value={u._id}>{(u.fullName || u.userName)} - {u.email}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Role</Label>
            <select className="w-full border rounded px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="ADMIN">ADMIN</option>
              <option value="SUB_ADMIN">SUB_ADMIN</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Active</Label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Module</th>
                {RIGHTS.map((r) => (
                  <th key={r} className="px-4 py-2 text-left">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((m) => (
                <tr key={m} className="border-t border-gray-200">
                  <td className="px-4 py-2 font-medium">{m}</td>
                  {RIGHTS.map((r) => (
                    <td key={r} className="px-4 py-2">
                      <input type="checkbox" checked={hasRight(m, r)} onChange={() => onToggleRight(m, r)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/users/admins')}>Cancel</Button>
          <Button type="submit" disabled={isSaving || (!editId && !userId)}>{editId ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </div>
  )
}

export default AddAdmin
