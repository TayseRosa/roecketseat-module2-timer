import { useEffect, useState } from 'react';
import { Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod';
import { differenceInSeconds } from 'date-fns'

import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountdownButton, TaskInput } from './styles';

const newCycleFormValidationSchema = zod.object({
    task:zod.string().min(1, 'INforme a tarefa'),
    minutesAmount: zod.number().min(5).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle{
    id: string
    task:string
    minutesAmount: number,
    startDate: Date
}

export function Home(){

    const [ cycles, setCycles ] = useState<Cycle[]>([]);
    const [ activeCycleId, setActiveCycleId ] = useState<string | null>(null)
    const [ amountSecondsPassed, setAmountSecondsPassed ] = useState(0);

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues:{
            task:'',
            minutesAmount: 0
        }
    });

    const activeCycle = cycles.find(cicle =>  cicle.id === activeCycleId)

    useEffect(()=>{
        if(activeCycle){
            setInterval(()=>{
                setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))
            },1000)
        }
    },[activeCycle]);

    function handleCreateNewCicle(data: NewCycleFormData){
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles(state => [...state, newCycle])
        setActiveCycleId(newCycle.id)

        reset()
    }

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    console.log(activeCycle);

    const task = watch('task')
    const isSubmitDisable = !task

    return(
        <HomeContainer>
            {/* Form */}
            <form onSubmit={handleSubmit(handleCreateNewCicle)} action="">
                <FormContainer>
                    <label htmlFor="task"> Vou trabalhar em </label>
                    <TaskInput 
                        id="task" 
                        list="task-suggestions"
                        placeholder='Dê um  nome para o seu projeto' 
                        {...register('task')}
                    />

                    <datalist id="task-suggestions" >
                        <option value="Projeto 1"></option>
                        <option value="Projeto 2"></option>
                        <option value="Projeto 3"></option>
                        <option value="Banana"></option>
                    </datalist>

                    <label htmlFor="">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount" 
                        placeholder='00' 
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>

                {/* countdown */}
                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                {/* Button */}
                <StartCountdownButton disabled={isSubmitDisable} type="submit">
                    <Play size={24} />
                    Começar
                </StartCountdownButton>
            </form>
        </HomeContainer>
    )
}