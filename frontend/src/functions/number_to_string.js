function number_with_commas(x) 
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  
export default function return_number_as_a_string(number) 
{
    let one_million = 1000000 - 1;
    let ten_million = 10000000 - 1;
    let one_hundred_million = 100000000 - 1;
    let one_billion = 1000000000 - 1;
    let ten_billion = 10000000000 -1;

    if(number > one_million && number < ten_million)
    {
        number = number.toString();
        const result = number[0] + "." + number[1] + " M"
        return result;
    }
    else if(number >= ten_million && number < one_hundred_million)
    {
        number = number.toString();
        const result = number[0] + number[1] +  " M";
        return result;
    }
    else if(number >= one_hundred_million && number < one_billion)
    {
        number = number.toString();
        const result = number[0] + number[1] + number[2] +  " M";
        return result;
    }
    else if(number >= one_billion && number < ten_billion)
    {
        number = number.toString();
        const result = number[0] + number[1] + number[2] + number[3] + " M";
        return result;
    }
    else if(number >= ten_billion)
    {
        const n_comm = number_with_commas(number)
        number = number.toString();
        const result = n_comm[0] + n_comm[1] + n_comm[2] + n_comm[3] +  n_comm[4] + n_comm[5] + " M";
        return result;
    }
    return number_with_commas(number.toString()) 
}

