import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Flex, Text, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon, Icon } from "@chakra-ui/icons";
import { MdEdit } from "react-icons/md";
import { createColumnHelper } from "@tanstack/react-table";

import { PrivateLayout } from "layouts/Private";
import { DataTable } from "components/DataTable";
import { Input } from "components/FormFields";
import { useAuth } from "hooks/useAuth";
import { hasPermission } from "utils/permissions";
import { getAcceptedUsers } from "services/user";
import { getUnits } from "services/units";
import { roleNameById } from "utils/roles";
import { DeletionModal } from "./DeletionModal";
import { EditionModal } from "./EditionModal";

function Users() {
  const [filter, setFilter] = useState<string>("");
  const [selectedUser, selectUser] = useState<User | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const { getUserData } = useAuth();
  const { data: userData, isFetched: isUserFetched } = useQuery({
    queryKey: ["user-data"],
    queryFn: getUserData,
  });
  const {
    data: usersData,
    isFetched: isUsersFetched,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["accepted-users"],
    queryFn: getAcceptedUsers,
  });
  const { data: unitsData, isFetched: isUnitsFetched } = useQuery({
    queryKey: ["units"],
    queryFn: getUnits,
  });
  const isActionDisabled = (actionName: string) =>
    userData?.value ? !hasPermission(userData.value, actionName) : true;
  const tableActions = useMemo(
    () => [
      {
        label: "Editar Usuário",
        icon: <Icon as={MdEdit} boxSize={4} />,
        action: ({ user }: { user: User }) => {
          selectUser(user);
          onEditOpen();
        },
        actionName: "edit-user",
        disabled: isActionDisabled("accept-user"),
      },
      {
        label: "Remover Usuário",
        icon: <DeleteIcon boxSize={4} />,
        action: ({ user }: { user: User }) => {
          selectUser(user);
          onDeleteOpen();
        },
        actionName: "delete-user",
        disabled: isActionDisabled("delete-user"),
      },
    ],
    []
  );
  const requests = useMemo<TableRow<User>[]>(() => {
    if (!isUsersFetched || !isUnitsFetched) return [];

    return (
      (usersData?.value?.reduce(
        (acc: TableRow<User>[] | User[], curr: TableRow<User> | User) => {
          if (
            !curr.fullName.toLowerCase().includes(filter.toLowerCase()) ||
            curr.cpf === userData?.value?.cpf
          )
            return acc;

          const role = roleNameById(curr.idRole);

          return [
            ...acc,
            {
              ...curr,
              unit:
                unitsData?.value?.find((item) => item.idUnit === curr.idUnit)
                  ?.name || "-",
              role,
              tableActions,
              actionsProps: { user: { ...curr, role } },
            },
          ];
        },
        []
      ) as TableRow<User>[]) || []
    );
  }, [usersData, unitsData, isUsersFetched, isUnitsFetched, filter]);

  const tableColumnHelper = createColumnHelper<TableRow<User>>();
  const tableColumns = [
    tableColumnHelper.accessor("fullName", {
      cell: (info) => info.getValue(),
      header: "Nome",
      meta: {
        isSortable: true,
      },
    }),
    tableColumnHelper.accessor("unit", {
      cell: (info) => info.getValue(),
      header: "Unidade",
      meta: {
        isSortable: true,
      },
    }),
    tableColumnHelper.accessor("role", {
      cell: (info) => info.getValue(),
      header: "Perfil",
      meta: {
        isSortable: true,
      },
    }),
    tableColumnHelper.accessor("tableActions", {
      cell: (info) => info.getValue(),
      header: "Ações",
      meta: {
        isTableActions: true,
        isSortable: false,
      },
    }),
  ];

  return (
    <PrivateLayout>
      <Flex w="90%" maxW={1120} flexDir="column" gap="3" mb="4">
        <Flex w="100%" justifyContent="space-between" gap="2" flexWrap="wrap">
          <Text fontSize="lg" fontWeight="semibold">
            Perfil de Acesso
          </Text>
        </Flex>
        <Flex w="100%" justifyContent="space-between" gap="2" flexWrap="wrap">
          <Input
            placeholder="Pesquisar usuário pelo nome"
            value={filter}
            onChange={({ target }) => setFilter(target.value)}
            variant="filled"
            css={{
              "&, &:hover, &:focus": {
                background: "white",
              },
            }}
          />
        </Flex>
      </Flex>
      <DataTable
        data={requests}
        columns={tableColumns}
        isDataFetching={!isUsersFetched || !isUserFetched}
        emptyTableMessage="Não foram encontradas solicitações no momento."
      />
      {userData?.value && selectedUser && isDeleteOpen ? (
        <DeletionModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          user={selectedUser}
          refetch={refetchUsers}
        />
      ) : null}
      {userData?.value && selectedUser && isEditOpen ? (
        <EditionModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          user={selectedUser}
          refetch={refetchUsers}
        />
      ) : null}
    </PrivateLayout>
  );
}

export default Users;
