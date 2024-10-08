"use client"

import { DataTableBasic } from "@/components/customs/datatables"
import { Modal } from "@/components/customs/modal"
import AlertForm from "@/components/forms/Alert"
import PageAlertEvent from "@/components/pages/alerts/AlertTable"
import { alertColumns } from "@/components/pages/alerts/Column"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ALERT_LIST } from "@/contexts/actions"
import usePagination from "@/hooks/usePagination"
import useSorting from "@/hooks/useSorting"
import { fetchPost } from "@/lib/fetchPost"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import { CgSpinner } from "react-icons/cg"
import { FaHome, FaUserPlus } from "react-icons/fa"
import { toast } from "react-toastify"

export default function AlertPage() {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)
    const rowEachPage = 10
    const { offset, limit, onPaginationChange, pagination } = usePagination(rowEachPage)
    const { sortKey, sortOrder, onSortingChange, sorting } = useSorting("-dateCreate")

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [ALERT_LIST, pagination],
        queryFn: () => fetchPost({
            url: '/api/device?dest=getAlertList',
            body: {
                offset,
                limit,
                sort: {[sortKey]: sortOrder}
            }
        }, true)
    })

    const deleteAlert = async (email) => {
        const req = await fetchPost({
            url: '/api/device?dest=deleteAlertData',
            body: { email }
        }, true)

        if(req.code) {
            toast.success('Successfully deleting alert account.')
            refetch()
        } else {
            toast.warn(req.message)
        }
    }

    return (
        <>
            {
                !session?.token?.access.includes("alerts") ?
                    <div className="flex flex-col gap-4 items-center justify-center h-[80vh]">
                        <Image
                            src={require("@/public/forbidden.png")}
                            alt="403 Forbidden"
                            className="self-center"
                            width={256}
                        />
                        <h1 className="text-2xl">You do not have permission to access this page.</h1>
                        <Button
                            size="icon"
                            className="group size-8 w-auto transition-all hover:justify-start gap-2 px-2 rounded-lg"
                            onClick={() => location.replace('/')}
                        ><FaHome /> Go back to Home</Button>
                    </div>
                :
                <>
                    <div className="mb-4">
                        <Card className="md:w-[1000px] overflow-scroll">
                            <CardHeader className="py-2 px-4 flex flex-row items-center justify-between mb-4">
                                <h1 className="text-md">Alerts</h1>
                                <Modal 
                                    open={open} 
                                    trigger={<Button variant="success" size="xs" className="flex items-center gap-1"><FaUserPlus/>Add Alert</Button>}
                                    onOpenChange={setOpen} 
                                    content={<AlertForm closeEvent={setOpen} />} 
                                    title={"New Target"}
                                    subTitle="Fill out the form below to add new target"
                                />
                            </CardHeader>
                            <CardContent className={
                                cn(
                                    'px-4'
                                )
                            }>
                                {
                                    isLoading && typeof data === "undefined" ?
                                    <div className="flex items-center gap-2">
                                        <CgSpinner className="animate-spin" /> Getting data...
                                    </div> :
                                    !isLoading && data?.result.length ?
                                        <DataTableBasic
                                            columns={alertColumns(deleteAlert)}
                                            data={data}
                                            isLoading={isLoading}
                                            error={error}
                                            rowEachPage={rowEachPage}
                                        />
                                    : null
                                }
                            </CardContent>
                        </Card>
                    </div>
                    <PageAlertEvent />
                </>
            }
        </>
    )
}