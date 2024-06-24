import { Gache } from '@/app/_types/gache.type'
import { getListAccessPortes, openDoor } from '@/app/_utils/requests'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { Button, Spin, Typography } from 'antd'
import React, {useState, useEffect, useRef} from 'react'

function ListeGaches() {
    const [listGaches, setListGaches] = useState<Array<Gache>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [unlockedGaches, setUnlockedGaches] = useState<Set<number>>(new Set());

    useEffect(() => {
        setIsLoading(true);
        getListAccessPortes().then((response) => {
            if (Array.isArray(response)) {
                setListGaches(response);
                console.table(response);
            } else {
                console.error(response.error);
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const handleButtonClick = (id: number) => {
        setUnlockedGaches((prev) => new Set(prev).add(id));

        openDoor(id).then((response) => {
            if ('response' in response && response.response === 'ok')  {
                // If response is 'ok', update the UI accordingly
                setTimeout(() => {
                    setUnlockedGaches((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(id);
                        return newSet;
                    });
                }, 3000);
            } else {
                // Handle response other than 'ok'
                setTimeout(() => {
                    setUnlockedGaches((prev) => {
                        const newSet = new Set(prev);
                        newSet.delete(id);
                        return newSet;
                    });
                }, 3000);
            }
        }).catch((error) => {
            console.error('Failed to open door:', error);
            // Handle the error if needed
            setTimeout(() => {
                setUnlockedGaches((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
            }, 3000);
        });
    };

    return (
        <>
            <Typography.Title level={4}>List des Gaches</Typography.Title>
            <div className='flex flex-col h-[350px] overflow-x-scroll gap-4 mt-6'>
                {isLoading ? (
                    <div className='w-full h-full flex items-center justify-center'>
                        <Spin />
                    </div>
                ) : (
                    listGaches.map((gache: Gache) => {
                        const isUnlocked = unlockedGaches.has(gache.id);
                        return (
                            <div key={`gache-${gache.id}`} className='flex flex-row w-full justify-between items-center'>
                                <Typography.Title level={5}>{gache.name}</Typography.Title>
                                <Button
                                    type='default'
                                    shape='circle'
                                    icon={isUnlocked ? <UnlockOutlined style={{ color: 'white' }}/> : <LockOutlined style={{ color: 'white' }}/>}
                                    onClick={() => handleButtonClick(gache.id)}
                                    style={isUnlocked ? { backgroundColor: 'green', borderColor: 'green' } : { backgroundColor: 'red', borderColor: 'red' }}
                                    disabled={isUnlocked}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}

export default ListeGaches;