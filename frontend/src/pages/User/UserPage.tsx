import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import { Box, Button, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import UsuariosModal from '../../components/UserModal'
import type { Role as UserRole, User, UserInput } from '../../types/user'
import {
  DeleteConfirmationDialog,
  EditConfirmationDialog,
  FeedbackSnackbar,
  type Feedback,
} from './components/UserDialogs'
import UserFilters from './components/UserFilters'
import UserHeader from './components/UserHeader'
import UserTable from './components/UserTable'
import { getUsers, removeUser, upsertUser, type UserFilters as AppliedFilters } from '../../api/userApi'

const DEFAULT_PAGE_SIZE = 50
const EMPTY_FILTERS: AppliedFilters = { name: '', role: '' }

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE)

  const [nameFilter, setNameFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(EMPTY_FILTERS)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>()

  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User>()
  const [pendingEdit, setPendingEdit] = useState<UserInput>()
  const [pendingDelete, setPendingDelete] = useState<User>()

  useEffect(() => {
    const controller = new AbortController()

    const loadUsers = async () => {
      setLoading(true)

      try {
        const result = await getUsers({
          page: page + 1,
          limit: rowsPerPage,
          filters: appliedFilters,
          signal: controller.signal,
        })

        setUsers(result.data)
        setTotal(result.total)
      } catch (error) {
        const requestWasCancelled = error instanceof DOMException && error.name === 'AbortError'

        if (!requestWasCancelled) {
          setFeedback({
            severity: 'error',
            message: error instanceof Error ? error.message : 'Erro ao carregar usuários.',
          })
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadUsers()
    return () => controller.abort()
  }, [appliedFilters, page, refreshKey, rowsPerPage])

  const hasActiveFilters = Boolean(appliedFilters.name || appliedFilters.role)
  const canClearFilters = Boolean(hasActiveFilters || nameFilter || roleFilter)

  const refreshUsers = () => {
    setRefreshKey((currentKey) => currentKey + 1)
  }

  const applyFilters = () => {
    setAppliedFilters({ name: nameFilter.trim(), role: roleFilter })
    setPage(0)
  }

  const clearFilters = () => {
    setNameFilter('')
    setRoleFilter('')
    setAppliedFilters(EMPTY_FILTERS)
    setPage(0)
  }

  const openCreateModal = () => {
    setSelectedUser(undefined)
    setIsUserModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const closeUserModal = () => {
    setIsUserModalOpen(false)
    setSelectedUser(undefined)
  }

  const reloadFirstPage = () => {
    if (page === 0) {
      refreshUsers()
      return
    }

    setPage(0)
  }

  const saveUser = async (input: UserInput) => {
    setSaving(true)

    try {
      await upsertUser(input)

      closeUserModal()
      setPendingEdit(undefined)
      setFeedback({
        severity: 'success',
        message: input.id ? 'Usuário atualizado com sucesso.' : 'Usuário adicionado com sucesso.',
      })
      reloadFirstPage()
    } catch (error) {
      setPendingEdit(undefined)
      setFeedback({
        severity: 'error',
        message: error instanceof Error ? error.message : 'Erro ao salvar usuário.',
      })
    } finally {
      setSaving(false)
    }
  }

  const submitUser = (input: UserInput) => {
    const isEditing = input.id !== undefined

    if (isEditing) {
      setPendingEdit(input)
      return
    }

    void saveUser(input)
  }

  const deleteUser = async () => {
    if (!pendingDelete) {
      return
    }

    setSaving(true)

    try {
      await removeUser(pendingDelete.id)

      setPendingDelete(undefined)
      setFeedback({ severity: 'success', message: 'Usuário excluído com sucesso.' })

      const currentPageWillBeEmpty = users.length === 1 && page > 0
      if (currentPageWillBeEmpty) {
        setPage((currentPage) => currentPage - 1)
      } else {
        refreshUsers()
      }
    } catch (error) {
      setPendingDelete(undefined)
      setFeedback({
        severity: 'error',
        message: error instanceof Error ? error.message : 'Erro ao excluir usuário.',
      })
    } finally {
      setSaving(false)
    }
  }

  const changeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage)
    setPage(0)
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <UserHeader />

      <Box sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 5 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            mb: 3,
            alignItems: { xs: 'stretch', sm: 'flex-end' },
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>
              Administração
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 800, letterSpacing: '-0.035em' }}
            >
              Usuários
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              Consulte e gerencie quem possui acesso ao sistema.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddRoundedIcon />}
            onClick={openCreateModal}
            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' } }}
          >
            Adicionar usuário
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 3 }}>
          <Stack
            direction="row"
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              borderBottom: 1,
              borderColor: 'divider',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 750 }}>Pessoas cadastradas</Typography>
              <Typography variant="body2" color="text.secondary">
                {total} {total === 1 ? 'usuário encontrado' : 'usuários encontrados'}
              </Typography>
            </Box>
            <Tooltip title="Atualizar lista">
              <span>
                <IconButton aria-label="Atualizar lista" onClick={refreshUsers} disabled={loading}>
                  <RefreshRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          <UserFilters
            name={nameFilter}
            role={roleFilter}
            canClear={canClearFilters}
            onNameChange={setNameFilter}
            onRoleChange={setRoleFilter}
            onApply={applyFilters}
            onClear={clearFilters}
          />

          <UserTable
            users={users}
            total={total}
            page={page}
            rowsPerPage={rowsPerPage}
            loading={loading}
            hasActiveFilters={hasActiveFilters}
            onCreate={openCreateModal}
            onEdit={openEditModal}
            onDelete={setPendingDelete}
            onClearFilters={clearFilters}
            onPageChange={setPage}
            onRowsPerPageChange={changeRowsPerPage}
          />
        </Paper>
      </Box>

      {isUserModalOpen && (
        <UsuariosModal
          open
          user={selectedUser}
          saving={saving}
          onClose={closeUserModal}
          onSubmit={submitUser}
        />
      )}

      <EditConfirmationDialog
        user={pendingEdit}
        saving={saving}
        onCancel={() => setPendingEdit(undefined)}
        onConfirm={() => pendingEdit && void saveUser(pendingEdit)}
      />
      <DeleteConfirmationDialog
        user={pendingDelete}
        saving={saving}
        onCancel={() => setPendingDelete(undefined)}
        onConfirm={() => void deleteUser()}
      />
      <FeedbackSnackbar feedback={feedback} onClose={() => setFeedback(undefined)} />
    </Box>
  )
}

export default UserPage
