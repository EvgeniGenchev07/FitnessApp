using CommunityToolkit.Mvvm.ComponentModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FitnessApp.ViewModels
{
    [ObservableObject]
    public partial class BaseViewModel
    {
        [ObservableProperty]
        private bool isBusy;
    }
}
