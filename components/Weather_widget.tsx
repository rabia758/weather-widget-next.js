"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData{
    temprerature: number;
    description: string;
    location: string;
    unit: string;
}

export default function WeatherWidget(){
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null >(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedLocation = location.trim();
        if(trimmedLocation === ""){
            setError ("Please Enter a valit Location. ");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try{
          const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
          );
          if(!response.ok){
            throw new Error("city not found.");
          }
          const data = await response.json();
          const weatherData: WeatherData = {
            temprerature: data.current.temp_c,
            description: data.current.condition.text,
            location: data.location.name,
            unit:"C",
          };
          setWeather(weatherData);
        }catch(error){
           setError("city not found.Please try agin");
           setWeather(null);
        }finally{
            setIsLoading(false);
        }
    };
    function getTempMsg(temprerature:number, unit:string):string {
        if(unit == "C"){
            if(temprerature < 0){
                return `It freezing at ${temprerature}°C! Bundle up!`;      
            }else if(temprerature < 10){
                return `It s quite cold at ${temprerature}°C! wear warm clothes.`
            }else if(temprerature < 20){
                return`The temperature is ${temprerature}°C! comfortable for a light jacket.`
            }else if(temprerature < 30){
                return`Its's a pleasent ${temprerature}°C. Enjoy the nice weather.`
            }else{
                return`It's hot at ${temprerature}°C. stay hydrated!`;
            }
        }else{
            return `${temprerature}°${unit}`;
        }
    }
    function getWeatherMessage (description: string):string{
        switch (description.toLocaleLowerCase()){
            case "sunny":
                return "It's a beautiful sunny day!";
            case "partly cloudly":
                return "Expect some clouds and sunshine.";
            case "Cloudly":
                return "It's cloudy day.";
            case "overcast":
                return "The sky is overcast.";
            case "rain":
                return "Don't forget Your umbrella! It's raining.";
            case "thunderstorm":
                return "Thunderstorms are expected todat.";
            case "mist":
                return "It's misty outside.";
            case "snow":
                return "Bundle up! It's snowing.";
            case "fog":
                return "Be careful, there's fog ouside.";
            default:
                return description;                                    
        }
    }
    function getLocationMsg (location:string):string{
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return `${location} ${isNight ? "at Night" : "During the Day"}`;
    }

    return(
      <div className="flex justify-center item-center h-400 mt-10">
        <Card className="w-full max-w-md mx-auto text-center border-fuchsia-950 border-solid">
            <CardHeader>
                <CardTitle className="text-red-950 underline text-3xl font-bold">Weather Widget</CardTitle>
                <CardDescription className="text-purple-950 text-1xl mt-20">"Search For The Current Weather Condition in Your City."</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit = {handleSearch} className="flex item-center gap-3">
                <input type=" text" placeholder=" Enter Your City Name" value = {location} onChange={(e)=> setLocation(e.target.value)} />
                <Button className="text-2xl" type="submit" disabled={isLoading}>
                    {isLoading? "Loading...." : "search"}
                </Button>
            </form>
            {error && <div className="mt-4 text-red-400">{error}</div>}
            {weather && (
                <div className="mt-4 grid gap-2">
                    <div className="flex item-center gap-2">
                        <ThermometerIcon className="w-6 h-6"/>
                        {getTempMsg(weather.temprerature,weather.unit)}
                    </div>
                    <div className="flex item-center gap-2">
                        <CloudIcon className="w-6 h-6"/>
                        {getWeatherMessage(weather.description)}
                    </div>
                    <div className="flex item-center gap-2">
                        <MapPinIcon className="w-6 h-6"/>
                        {getLocationMsg(weather.location)}
                    </div>
                </div>
            )}
            </CardContent>
        </Card>
      </div>
    )
}

