"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, Clock, Edit, Plus, Save, Trash, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  defaultTimeSlots,
  getTimeSlots,
  saveTimeSlots,
  defaultAppointmentTypes,
  getAppointmentTypes,
  saveAppointmentTypes,
  defaultAvailabilitySettings,
  getAvailabilitySettings,
  saveAvailabilitySettings,
} from "@/lib/utils";
import { availabilitySettingsSchema, appointmentTypeSchema } from "@/lib/schema";

export default function ConfigurePage() {
  // Router removed to fix lint error - add back if navigation is needed
  // const router = useRouter();
  const [activeTab, setActiveTab] = useState("availability");
  
  // Time slots state
  const [timeSlots, setTimeSlots] = useState<string[]>(getTimeSlots());
  const [newTimeSlot, setNewTimeSlot] = useState("");
  
  // Appointment types state
  const [appointmentTypes, setAppointmentTypes] = useState(getAppointmentTypes());
  const [editingType, setEditingType] = useState<null | {
    id: string;
    label: string;
    duration: number;
    color: string;
  }>(null);
  
  // Availability settings form
  const availabilityForm = useForm({
    resolver: zodResolver(availabilitySettingsSchema),
    defaultValues: getAvailabilitySettings(),
  });
  
  // Day of week names for display
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Handle time slot functions
  const addTimeSlot = () => {
    if (!newTimeSlot) return;
    
    // Format and validate the time slot
    let formattedSlot = newTimeSlot;
    
    // If it's in 24h format, convert to 12h format
    if (/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(newTimeSlot)) {
      const [hour, minute] = newTimeSlot.split(':').map(Number);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      const formattedMinute = minute.toString().padStart(2, '0');
      formattedSlot = `${displayHour}:${formattedMinute} ${period}`;
    }
    
    if (!timeSlots.includes(formattedSlot)) {
      const newSlots = [...timeSlots, formattedSlot].sort((a, b) => {
        // Convert to 24h for sorting
        const aTime = convertTo24Hour(a);
        const bTime = convertTo24Hour(b);
        return aTime.localeCompare(bTime);
      });
      setTimeSlots(newSlots);
      saveTimeSlots(newSlots);
      setNewTimeSlot("");
    }
  };
  
  const removeTimeSlot = (slot: string) => {
    const newSlots = timeSlots.filter(s => s !== slot);
    setTimeSlots(newSlots);
    saveTimeSlots(newSlots);
  };
  
  const resetTimeSlots = () => {
    setTimeSlots(defaultTimeSlots);
    saveTimeSlots(defaultTimeSlots);
  };
  
  // Convert 12h format to 24h for sorting
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let hours;
    const minutes = time.split(':')[1];
    hours = time.split(':')[0];
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours.padStart(2, '0')}:${minutes}`;
  };
  
  // Handle appointment type functions
  const saveAppointmentType = () => {
    if (!editingType) return;
    
    const { id, label, duration, color } = editingType;
    
    // Validate fields
    if (!label || !duration || !color) return;
    
    try {
      // Validate with Zod schema
      appointmentTypeSchema.parse(editingType);
      
      const existingIndex = appointmentTypes.findIndex((t: { id: string }) => t.id === id);
      
      if (existingIndex >= 0) {
        // Update existing type
        const updatedTypes = [...appointmentTypes];
        updatedTypes[existingIndex] = editingType;
        setAppointmentTypes(updatedTypes);
        saveAppointmentTypes(updatedTypes);
      } else {
        // Add new type
        const updatedTypes = [...appointmentTypes, editingType];
        setAppointmentTypes(updatedTypes);
        saveAppointmentTypes(updatedTypes);
      }
      
      setEditingType(null);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };
  
  const deleteAppointmentType = (id: string) => {
    const updatedTypes = appointmentTypes.filter((t: { id: string }) => t.id !== id);
    setAppointmentTypes(updatedTypes);
    saveAppointmentTypes(updatedTypes);
  };
  
  const resetAppointmentTypes = () => {
    setAppointmentTypes(defaultAppointmentTypes);
    saveAppointmentTypes(defaultAppointmentTypes);
  };
  
  // Handle availability settings
  const onAvailabilitySubmit = (data: typeof defaultAvailabilitySettings) => {
    saveAvailabilitySettings(data);
  };
  
  const resetAvailabilitySettings = () => {
    availabilityForm.reset(defaultAvailabilitySettings);
    saveAvailabilitySettings(defaultAvailabilitySettings);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configure</h1>
          <p className="text-muted-foreground">
            Customize your appointment settings
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="availability" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
          <TabsTrigger value="types">Appointment Types</TabsTrigger>
        </TabsList>
        
        {/* Availability Settings Tab */}
        <TabsContent value="availability" className="space-y-4 py-4">
          <Form {...availabilityForm}>
            <form onSubmit={availabilityForm.handleSubmit(onAvailabilitySubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Working Hours</CardTitle>
                  <CardDescription>
                    Set your working days and hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={availabilityForm.control}
                    name="workDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working Days</FormLabel>
                        <div className="grid grid-cols-7 gap-2">
                          {daysOfWeek.map((day, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2">
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  id={`day-${index}`}
                                  checked={field.value.includes(index)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange([...field.value, index].sort());
                                    } else {
                                      field.onChange(field.value.filter((day: number) => day !== index));
                                    }
                                  }}
                                  className="h-4 w-4"
                                />
                              </div>
                              <Label htmlFor={`day-${index}`} className="text-xs">
                                {day.slice(0, 3)}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={availabilityForm.control}
                      name="workHours.start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            When your work day starts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={availabilityForm.control}
                      name="workHours.end"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            When your work day ends
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Settings</CardTitle>
                  <CardDescription>
                    Configure appointment duration and scheduling options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={availabilityForm.control}
                      name="appointmentDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={5} 
                              max={240} 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Default length of appointments
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={availabilityForm.control}
                      name="bufferTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buffer Time (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={60} 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Break between appointments
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={availabilityForm.control}
                      name="timeSlotInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Slot Interval (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={5} 
                              max={60} 
                              step={5}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Frequency of appointment slots
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={availabilityForm.control}
                      name="maxDaysInAdvance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Window (days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={365}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            How far in advance appointments can be booked
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetAvailabilitySettings}
                  >
                    Reset to Defaults
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </TabsContent>
        
        {/* Time Slots Tab */}
        <TabsContent value="timeslots" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Slots</CardTitle>
              <CardDescription>
                Manage available time slots for appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="e.g. 9:00 AM or 14:30"
                    className="flex-1"
                  />
                  <Button onClick={addTimeSlot}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <div 
                      key={slot} 
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{slot}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeTimeSlot(slot)}
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {timeSlots.length === 0 && (
                  <div className="flex items-center justify-center h-20 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">No time slots defined</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetTimeSlots}>
                Reset to Defaults
              </Button>
              <Button onClick={() => setActiveTab("availability")}>
                Continue
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Appointment Types Tab */}
        <TabsContent value="types" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Types</CardTitle>
              <CardDescription>
                Configure different types of appointments you offer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Appointment type list */}
                <div className="space-y-3">
                  {appointmentTypes.map((type: { id: string; label: string; duration: number; color: string }) => (
                    <div
                      key={type.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-4 h-4 rounded-full ${type.color.split(' ')[0]}`} 
                          aria-hidden="true"
                        />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {type.duration} minutes
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingType(type)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAppointmentType(type.id)}
                          disabled={appointmentTypes.length <= 1}
                          className="text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Add/Edit appointment type */}
                <div className="space-y-4 p-4 border rounded-md">
                  <h3 className="text-lg font-medium">
                    {editingType?.id ? "Edit Appointment Type" : "Add New Appointment Type"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type-label">Type Name</Label>
                      <Input
                        id="type-label"
                        value={editingType?.label || ""}
                        onChange={(e) => setEditingType({
                          ...(editingType || { id: uuidv4(), duration: 60, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" }),
                          label: e.target.value
                        })}
                        placeholder="e.g. Consultation"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type-duration">Duration (minutes)</Label>
                      <Input
                        id="type-duration"
                        type="number"
                        min={5}
                        max={240}
                        value={editingType?.duration || ""}
                        onChange={(e) => setEditingType({
                          ...(editingType || { id: uuidv4(), label: "", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" }),
                          duration: parseInt(e.target.value)
                        })}
                        placeholder="60"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { name: "Blue", value: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
                        { name: "Green", value: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
                        { name: "Purple", value: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
                        { name: "Red", value: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
                        { name: "Orange", value: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
                        { name: "Yellow", value: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
                        { name: "Lime", value: "bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300" },
                        { name: "Gray", value: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
                      ].map((color) => (
                        <div
                          key={color.value}
                          className={`p-2 rounded cursor-pointer flex items-center justify-center ${color.value} ${
                            editingType?.color === color.value ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => setEditingType({
                            ...(editingType || { id: uuidv4(), label: "", duration: 60 }),
                            color: color.value
                          })}
                        >
                          {editingType?.color === color.value && <Check className="h-4 w-4" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingType(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={saveAppointmentType}
                      disabled={!editingType?.label || !editingType?.duration}
                    >
                      {editingType?.id && appointmentTypes.some((t: { id: string }) => t.id === editingType.id) ? "Update" : "Add"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetAppointmentTypes}>
                Reset to Defaults
              </Button>
              <Button onClick={() => setActiveTab("availability")}>
                Continue
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}