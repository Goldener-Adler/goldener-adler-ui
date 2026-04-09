import {type FunctionComponent, useEffect, useState} from "react";
import {Page} from "@/components/layouts/Page.tsx";
import {Navigate, useNavigate, useParams} from "react-router";
import {useGetBookingDetails} from "@/hooks/useGetBookingDetails.tsx";
import {DashboardSpacing} from "@/components/layouts/DashboardSpacing.tsx";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet
} from "@/components/ui/field.tsx";
import {InputViewOnly} from "@/components/ui/input-view-only.tsx";
import {TextareaViewOnly} from "@/components/ui/textarea-view-only.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useStateWithQueryParams} from "@/hooks/useStateWithQueryParams.ts";
import {Input} from "@/components/ui/input.tsx";
import type {Booking} from "@/assets/types.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {API_ENDPOINT} from "@/assets/consts.ts";
import {DatePicker} from "@/components/ui/date-picker.tsx";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {Trash2Icon} from "lucide-react";
import {toast} from "sonner";

export const BookingDetails: FunctionComponent = () => {
  let { id } = useParams();
  if (!id) {
    return <Navigate to="/dashboard/bookings" replace />
  }
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isInEditMode, setIsInEditMode] = useStateWithQueryParams<boolean>(false, 'edit', (parsedData: unknown): parsedData is boolean => typeof parsedData === 'boolean');
  const [formData, setFormData] = useState<Booking | null>(null)

  const bookingDetails = useGetBookingDetails(id);

  useEffect(() => {
    setFormData(bookingDetails.data)
  }, [bookingDetails.data?.id])

  // TODO: extract fetches to separate file
  const updateBookingMutation = useMutation({
    mutationFn: async (updated: Booking) => {
      return fetch(`${API_ENDPOINT}/bookings/${updated.id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json())
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["booking", data.id], data)
      setIsInEditMode(false)
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (deletedId: Booking['id']) => {
      const response = await fetch(`${API_ENDPOINT}/bookings/${deletedId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      // TODO: Handle this generally
      if (!response.ok) {
        throw new Error(`Failed to delete booking ${deletedId}`);
      }

      return response.json();
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"]});
      toast.success(`Buchung ${deletedId} wurde gelöscht.`)
      navigate('/dashboard/bookings');
    },
    onError: (error, idToDelete) => {
      toast.error(`Buchung ${idToDelete} konnte nicht gelöscht werden. ${error}`)
    }
  })

  if (!bookingDetails.isPending && !bookingDetails.isSuccess) {
    return <Navigate to="/dashboard/bookings" replace />
  }

  const handleEditButtonClick = () => {
    if (!isInEditMode) {
      setIsInEditMode(true);
    } else {
      if(!formData) return;
      updateBookingMutation.mutate(formData);
    }
  }

  if (bookingDetails.isPending) {
    return <div>loading</div>
  }

  return (
    <Page>
      <DashboardSpacing>
        <div className="max-w-4xl">
          <div className="flex justify-between">
            <h1>Buchung {bookingDetails.data.id}</h1>
            <div className="flex flex-nowrap gap-2">
              <Button variant="outline" onClick={handleEditButtonClick} disabled={updateBookingMutation.isPending}>
                {isInEditMode ? 'Speichern' : 'Bearbeiten'}
              </Button>
            </div>
          </div>
        <form>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Buchungsdaten</FieldLegend>
              <FieldDescription>ID: {bookingDetails.data.id}</FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Vorname</FieldLabel>
                    {isInEditMode ? (
                      <Input
                        value={formData?.firstName ?? ""}
                        onChange={(e) =>
                          setFormData((prev) =>
                            prev ? { ...prev, firstName: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      <InputViewOnly value={bookingDetails.data.firstName} />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    {isInEditMode ? (
                      <Input
                        value={formData?.lastName ?? ""}
                        onChange={(e) =>
                          setFormData((prev) =>
                            prev ? { ...prev, lastName: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      <InputViewOnly value={bookingDetails.data.lastName} />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    {isInEditMode ? (
                      <Input
                        type="email"
                        value={formData?.email ?? ""}
                        onChange={(e) =>
                          setFormData((prev) =>
                            prev ? { ...prev, email: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      <InputViewOnly value={bookingDetails.data.email} />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Telefon</FieldLabel>
                    {isInEditMode ? (
                      <Input
                        type="tel"
                        placeholder="Keine Angabe"
                        value={formData?.phone ?? ""}
                        onChange={(e) =>
                          setFormData((prev) =>
                            prev ? { ...prev, phone: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      <InputViewOnly placeholder="Keine Angabe" value={bookingDetails.data.phone} />
                    )}
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Nachricht</FieldLabel>
                  <TextareaViewOnly value={bookingDetails.data.message} />
                </Field>
                <FieldSeparator/>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Check-In</FieldLabel>
                    {isInEditMode ? (
                      <DatePicker value={formData?.from} onChange={(newFromDate) =>
                        setFormData((prev) =>
                          prev && newFromDate ? { ...prev, from: newFromDate } : prev
                        )
                      } />
                    ) : (
                      <InputViewOnly value={bookingDetails.data.from.toLocaleDateString()} />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Check-Out</FieldLabel>
                    {isInEditMode ? (
                      <DatePicker value={formData?.to} onChange={(newToDate) =>
                        setFormData((prev) =>
                          prev && newToDate ? { ...prev, to: newToDate } : prev
                        )
                      } />
                    ) : (
                      <InputViewOnly value={bookingDetails.data.to.toLocaleDateString()} />
                    )}
                  </Field>
                </div>
                {isInEditMode && (
                  <>
                    <FieldSeparator/>
                    <div className="w-fit">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive-outline">Löschen</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent size="sm">
                          <AlertDialogHeader>
                            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                              <Trash2Icon />
                            </AlertDialogMedia>
                            <AlertDialogTitle>Buchung Löschen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Die Buchung wird entgültig gelöscht und kann nicht widerhergestellt werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => deleteBookingMutation.mutate(bookingDetails.data.id)}>Löschen</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
        </div>
      </DashboardSpacing>
    </Page>
  )
}