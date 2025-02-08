using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using FitnessApp.Models;
using FitnessApp.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FitnessApp.ViewModels
{
    public partial class SignUpViewModel : BaseViewModel
    {
        [ObservableProperty]
        private string name;

        [ObservableProperty]
        private string email;

        [ObservableProperty]
        private string password;

        private const string _name_pattern = @"[a-zA-Zа-яА-Я ]{6,}";
        private const string _email_pattern = @"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}";
        private const string _password_pattern = @"(?=.*[a-z])(?=.*[A-Z]).{8,}";


        [RelayCommand]
        private async Task CreateUser()
        {
            if (!IsBusy)
            {
                IsBusy = true;
                if (!string.IsNullOrEmpty(Name) &&
                    !string.IsNullOrWhiteSpace(Password) &&
                    !string.IsNullOrWhiteSpace(Email))
                {
                    if (Regex.IsMatch(Name, _name_pattern))
                    {
                        if (Regex.IsMatch(Email, _email_pattern))
                        {
                            if (Regex.IsMatch(Password, _password_pattern))
                            {
                                try
                                {

                                    User user = new User(Name, Email, Password);
                                    //db fetch
                                    await Shell.Current.GoToAsync($"//{nameof(ListPage)}");
                                }
                                catch (Exception ex)
                                {
                                    await Shell.Current.DisplayAlert("Error", ex.Message, "Ok");

                                }
                                finally
                                {
                                    IsBusy = false;
                                }
                            }
                            else
                            {
                                await Shell.Current.DisplayAlert("Error", "Incorrect password!", "Ok");
                            }
                        }
                        else
                        {
                            await Shell.Current.DisplayAlert("Error", "Incorrect email!", "Ok");
                        }
                    }
                    else
                    {
                        await Shell.Current.DisplayAlert("Error", "Incorrect name!", "Ok");
                    }
                }
                else
                {
                    await Shell.Current.DisplayAlert("Error", "All fields must be filled!", "Ok");
                }
                IsBusy = false;
            }
        }
        [RelayCommand]
        private async Task GoToLogin()
        {
            if (!IsBusy)
            {
                IsBusy = true;
                await Shell.Current.GoToAsync($"//{nameof(LoginPage)}");
                IsBusy = false;
            }
        }
    }
}

